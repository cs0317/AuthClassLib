import CST = require("./CST");
import GenericAuth = require("./GenericAuth");

/***********************************************************/
/*               Messages between parties                  */
/***********************************************************/

export class AuthorizationRequest extends GenericAuth.SignInIdP_Req
{
    response_type: string;
    client_id: string;
    get Realm(): string { return this.client_id; };
    set Realm(value: string) { this.client_id = value; };
    redirect_uri: string= null;
    scope: string;
    state: string = null;
}

export class AuthorizationResponse extends GenericAuth.SignInIdP_Resp_SignInRP_Req
{
     code: string ;
     state: string = null;
}

export class AuthorizationErrorResponse extends GenericAuth.SignInIdP_Resp_SignInRP_Req
{
     protected error:string;
     protected error_description: string = null;
     protected error_uri:string = null;
     protected state: string = null;
}

export class AccessTokenRequest
{
    grant_type: string;
    code: string;
    redirect_uri: string;
    client_id: string;
    refresh_token: string = null;
}

export class AccessTokenResponse
{
    access_token: string;  
    token_type: string;
    expires_in: string;
    client_id: string;
    refresh_token: string = null;
    scope: string = null;
}

/***********************************************************/
/*               Data structures on parties                */
/***********************************************************/

export class AuthorizationCodeEntry extends GenericAuth.ID_Claim
{
    //Note: property UserID is not defined in OAuth. It is supposed to be defined at a more concrete level.
    code: string;
    primaryUID: string;
    redirect_uri: string;
    get Redir_dest(): string { return this.redirect_uri; } 
    scope: string;
    state: string;
}

export class AccessTokenEntry extends GenericAuth.ID_Claim
{
    //Note: property UserID is not defined in OAuth. It is supposed to be defined at a more concrete level.
    access_token: string;
    primaryUID: string;
    redirect_uri: string;
    get Redir_dest(): string { return this.redirect_uri; }
    scope: string;
    refresh_token: string = null;
    state: string;
   /* client_id: string;
    get Realm(): string { return this.client_id; };
    set Realm(value: string) { this.client_id = value; };
    */
}

export interface AuthorizationCodeRecs extends GenericAuth.IdPAuthRecords_Base
{
     findISSByClientIDAndCode(client_id:string , authorization_code: string ): string;
}

export interface AccessTokenRecs extends GenericAuth.IdPAuthRecords_Base
{
    findISSByClientIDAndAccessToken(client_id: string,  access_token: string): string;
    findISSByClientIDAndRefreshToken(client_id: string, refresh_token: string): string;
}

/***********************************************************/
/*                          Parties                        */
/***********************************************************/
export abstract class Client extends GenericAuth.RP
{
    client_id: string;
    get Realm() { return this.client_id; }
    set Realm(value: string) { this.client_id = value; };
    client_secret: string;
    TokenEndpointUrl:string;
    return_uri: string;
    get Domain() { return this.return_uri; }
    set Domain(value: string) { this.return_uri = value; };
    constructor(client_id1?: string, return_uri1?: string, client_secret1?: string, TokenEndpointUrl1?: string) {
        super();
        this.client_id = client_id1; 
        this.return_uri = return_uri1;
        this.client_secret = client_secret1;
        this.TokenEndpointUrl = TokenEndpointUrl1
    }      
}

export abstract class AuthorizationServer extends GenericAuth.AS
{
    get AuthorizationCodeRecs(): AuthorizationCodeRecs { return <AuthorizationCodeRecs>(this.IdentityRecords); }
    set AuthorizationCodeRecs(value: AuthorizationCodeRecs) { this.IdentityRecords = value;  }

    AccessTokenRecs: AccessTokenRecs;

    init(AuthorizationCodeRecs1?: AuthorizationCodeRecs , AccessTokenRecs1?: AccessTokenRecs )
    {
        this.AuthorizationCodeRecs = AuthorizationCodeRecs1;
        this.AccessTokenRecs = AccessTokenRecs1;
    }

    /*
    //This method seems useless. Perhaps Daniel didn't understand that SignInIdP is implemnted in the base class.
    //It is supposed to be a concrete method, not to be overridden.
    SignInIdP(req: GenericAuth.SignInIdP_Req ): GenericAuth.SignInIdP_Resp_SignInRP_Req{
        GenericAuth.GlobalObjects_base.SignInIdP_Req = req;

        if (req == null) return null;
        let req1: AuthorizationRequest = <AuthorizationRequest>req;
        var _ID_Claim: GenericAuth.ID_Claim ;

        switch (req1.response_type) {
            case "code":
                _ID_Claim = createAuthorizationCodeEntry(req1);
                if (this.IdentityRecords.setEntry(req1.IdPSessionSecret, req1.Realm, _ID_Claim) == false)
                    return null;
                break;
            case "token":
              
                break;
            default:
                return null;
        }

        return this.Redir(_ID_Claim.Redir_dest, _ID_Claim);
    }
    */
    Process_SignInIdP_req(req1: GenericAuth.SignInIdP_Req): GenericAuth.ID_Claim
    {
        let req:AuthorizationRequest = <AuthorizationRequest>req1;
        switch (req.response_type) {
            case "code":
                return this.createAuthorizationCodeEntry(req);
            default:
                return null;
        }
    }

    protected  TokenEndpoint(req: AccessTokenRequest ):AccessTokenResponse
    {
        var AccessTokenEntry: AccessTokenEntry;
        var IdPSessionSecret:string;
        if (req == null) return null;
        let resp: AccessTokenResponse  = new AccessTokenResponse();
        //CST_Ops.recordme(this, req, resp);
        switch (req.grant_type) {
        case "authorization_code":
            IdPSessionSecret = this.AuthorizationCodeRecs.findISSByClientIDAndCode(req.client_id, req.code);
            if (IdPSessionSecret == null)
                return null;
            let AuthCodeEntry:AuthorizationCodeEntry = <AuthorizationCodeEntry>this.AuthorizationCodeRecs.getEntry(IdPSessionSecret, req.client_id);
            if (AuthCodeEntry.redirect_uri != req.redirect_uri)
                return null;
            AccessTokenEntry = this.createAccessTokenEntry(AuthCodeEntry.redirect_uri, AuthCodeEntry.scope, AuthCodeEntry.state);
            if (this.AccessTokenRecs.setEntry(AccessTokenEntry.access_token, req.client_id, AccessTokenEntry) == false)
                return null;

            resp.access_token = AccessTokenEntry.access_token;
            resp.refresh_token = AccessTokenEntry.refresh_token;
            resp.scope = AccessTokenEntry.scope;
            return resp;
        case "refresh_token":
            IdPSessionSecret = this.AccessTokenRecs.findISSByClientIDAndRefreshToken(req.client_id, req.refresh_token);
            if (IdPSessionSecret == null)
                return null;
            AccessTokenEntry = <AccessTokenEntry>this.AccessTokenRecs.getEntry(IdPSessionSecret, req.client_id);
            let newAccessTokenEntry: AccessTokenEntry = this.createAccessTokenEntry(AccessTokenEntry.redirect_uri, AccessTokenEntry.scope, AccessTokenEntry.state);
            if (this.AccessTokenRecs.setEntry(newAccessTokenEntry.access_token, req.client_id, newAccessTokenEntry) == false)
                return null;
            resp.access_token = AccessTokenEntry.access_token;
            resp.refresh_token = AccessTokenEntry.refresh_token;
            resp.scope = AccessTokenEntry.scope;
            return resp;
        default:
            return null;
        }
    }
    abstract  createAuthorizationCodeEntry(req:AuthorizationRequest):AuthorizationCodeEntry;
    abstract  createAccessTokenEntry(redirect_uri:string, scope:string, state: string):AccessTokenEntry;
}