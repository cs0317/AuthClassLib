var config = require('../../config.js');
var utils = require("../../Common/utils");
import OAuth20 = require("../../AuthClassHierarchy/OAuth20");
import CST = require("../../AuthClassHierarchy/CST");
import GenericAuth = require("../../AuthClassHierarchy/GenericAuth");


export class MSAuthorizationRequest extends OAuth20.AuthorizationRequest {
    response_mode: string;
}
export class MSAuthConclusion extends GenericAuth.AuthenticationConclusion {
    Email: string;
    FullName: string;
    Live_ID: string
}
export class MicrosoftRegisteredEmails {
    account: string;
    business: string;
    personal: string;
    prefered: string;
}
export class MSUserProfileResponse extends OAuth20.UserProfileResponse {
    id: string;
    name: string;
    emails: MicrosoftRegisteredEmails;
}
export class Microsoft_RP extends OAuth20.Client {
    UserProfileUrl: string;
    constructor(client_id1?: string, return_uri1?: string, client_secret1?: string, AuthorizationEndpointUrl1?: string, TokenEndpointUrl1?: string, UserProfileUrl1?: string) {
        super(client_id1, return_uri1, client_secret1, AuthorizationEndpointUrl1, TokenEndpointUrl1);
        this.UserProfileUrl = UserProfileUrl1;
    }

    /*** implementing the methods for AuthorizationRequest ***/
    public createAuthorizationRequest(inputMSG: CST.CST_MSG): OAuth20.AuthorizationRequest {
        var _MSAuthorizationRequest: MSAuthorizationRequest = new MSAuthorizationRequest();
        _MSAuthorizationRequest.client_id = this.client_id;
        _MSAuthorizationRequest.response_type = "code";
        _MSAuthorizationRequest.scope = "wl.basic wl.emails";
        _MSAuthorizationRequest.redirect_uri = this.return_uri;
        _MSAuthorizationRequest.response_mode = "form_post";
        return _MSAuthorizationRequest;
    }
    public marshalCreateAuthorizationRequest(_FBAuthorizationRequest: OAuth20.AuthorizationRequest){  
        return this.AuthorizationEndpointUrl + "?" +
            utils.makeQueryString(_FBAuthorizationRequest, ["client_id", "redirect_uri", "scope", "response_type", "response_mode", "SymT", "SignedBy"]);
    }

    /*** implementing the methods for AccessTokenRequest ***/
   createAccessTokenRequest(inputMSG: CST.CST_MSG): OAuth20.AccessTokenRequest {
        var _AccessTokenRequest: OAuth20.AccessTokenRequest = new OAuth20.AccessTokenRequest();
        _AccessTokenRequest.client_id = this.client_id;
        _AccessTokenRequest.code = (<OAuth20.AuthorizationResponse>inputMSG).code;
        _AccessTokenRequest.redirect_uri = this.return_uri;
        _AccessTokenRequest.client_secret = this.client_secret;
        _AccessTokenRequest.grant_type = "authorization_code";
        return _AccessTokenRequest;
    }

    marshalCreateAccessTokenRequest(_AccessTokenRequest: OAuth20.AccessTokenRequest) {
        /*var RawRequestUrl = this.TokenEndpointUrl + "?client_id=" + _AccessTokenRequest.client_id + "&redirect_uri=" + _AccessTokenRequest.redirect_uri
            + "&client_secret=" + _AccessTokenRequest.client_secret + "&code=" + _AccessTokenRequest.code;*/
        var rawReq = {
            url: "https://login.live.com/oauth20_token.srf",
            method: "post",
            form: {
                client_id: _AccessTokenRequest.client_id,
                redirect_uri: _AccessTokenRequest.redirect_uri,
                client_secret: _AccessTokenRequest.client_secret,
                code: _AccessTokenRequest.code,
                grant_type: _AccessTokenRequest.grant_type
            }
        };
        return rawReq;
   }

    /*** implementing the methods for UserProfileRequest ***/
    createUserProfileRequest(inputMSG: CST.CST_MSG): OAuth20.UserProfileRequest {
        var _UserProfileRequest: OAuth20.UserProfileRequest = new OAuth20.UserProfileRequest();
        _UserProfileRequest.access_token = (<OAuth20.AccessTokenResponse>inputMSG).access_token;
        return _UserProfileRequest;
    }

    marshalCreateUserProfileRequest(_UserProfileRequest: OAuth20.UserProfileRequest) {
        var RawRequestUrl = this.UserProfileUrl + "?access_token=" + _UserProfileRequest.access_token;
        return ({
            url: RawRequestUrl,
            method: "get"
        });
    }

    /*** implementing the methods for AuthenticationConclusion ***/
    createConclusion(inputMSG: CST.CST_MSG): GenericAuth.AuthenticationConclusion {
        var _MSAuthConclusion = new MSAuthConclusion();
        _MSAuthConclusion.UserID = (<MSUserProfileResponse>inputMSG).emails.account;
        _MSAuthConclusion.Email = (<MSUserProfileResponse>inputMSG).emails.account;
        _MSAuthConclusion.Live_ID = (<MSUserProfileResponse>inputMSG).id;
        _MSAuthConclusion.FullName = (<MSUserProfileResponse>inputMSG).name;
        return _MSAuthConclusion;
    }
}
