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
}

/***********************************************************/
/*               Data structures on parties                */
/***********************************************************/

export class AuthorizationCodeEntry extends GenericAuth.ID_Claim
{
    //Note: property UserID is not defined in OAuth. It is supposed to be defined at a more concrete level.
    code: string;
    userID_on_AS: string;
    redirect_uri: string;
    get Redir_dest(): string { return this.redirect_uri; } 
    scope: string;
    state: string;
}

export class AccessTokenEntry 
{
    //Note: property UserID is not defined in OAuth. It is supposed to be defined at a more concrete level.
    access_token: string;
    userID_on_AS: string;
    redirect_uri: string;
    get Redir_dest(): string { return this.redirect_uri; }
    scope: string;
    refresh_token: string = null;
    state: string;
    client_id: string;
    get Realm(): string { return this.client_id; };
    set Realm(value: string) { this.client_id = value; };
}

