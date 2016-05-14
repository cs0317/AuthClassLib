var config = require('../../config.js');
var communication = require("../../Common/communication");
import OAuth20 = require("../../AuthClassHierarchy/OAuth20");
import CST = require("../../AuthClassHierarchy/CST");
import GenericAuth = require("../../AuthClassHierarchy/GenericAuth");

class DebugTokenRequest {
}
export class FBAuthorizationRequest extends OAuth20.AuthorizationRequest {
    type: string;
}
export class FBAuthConclusion extends GenericAuth.AuthenticationConclusion {
    Email: string;
    FullName: string;
    FB_ID: string
}
export class Facebook_RP extends OAuth20.Client {
    UserProfileUrl: string;
    constructor(client_id1?: string, return_uri1?: string, client_secret1?: string, AuthorizationEndpointUrl1?: string, TokenEndpointUrl1?: string, UserProfileUrl1?: string) {
        super(client_id1, return_uri1, client_secret1, AuthorizationEndpointUrl1, TokenEndpointUrl1);
        this.UserProfileUrl = UserProfileUrl1;
    }

    /*** implementing the three methods for AuthorizationRequest ***/
    parseForCreateAuthorizationRequest(req): CST.CST_MSG {
        return null;
    }
    public createAuthorizationRequest(): OAuth20.AuthorizationRequest {
        var _FBAuthorizationRequest: FBAuthorizationRequest = new FBAuthorizationRequest();
        _FBAuthorizationRequest.client_id = this.client_id;
        _FBAuthorizationRequest.response_type = "code";
        _FBAuthorizationRequest.scope = "user_about_me email";
        _FBAuthorizationRequest.redirect_uri = this.return_uri;
        _FBAuthorizationRequest.type = "web_server";
        return _FBAuthorizationRequest;
    }
    public marshalForCreateAuthorizationRequest(_FBAuthorizationRequest: OAuth20.AuthorizationRequest){  
        return this.AuthorizationEndpointUrl + "?" +
            communication.makeQueryString(_FBAuthorizationRequest, ["client_id", "redirect_uri", "scope", "response_type", "type", "SymT", "SignedBy"]);
    }

    /*** implementing the three methods for AccessTokenRequest ***/
   parseForCreateAccessTokenRequest(req): CST.CST_MSG {
        if (req.query.error) {
            // user might have disallowed the app
            return null;
        }
        var inputMSG: OAuth20.AuthorizationResponse = new OAuth20.AuthorizationResponse(req.query);
        return inputMSG;
    }

   createAccessTokenRequest(inputMSG: CST.CST_MSG): OAuth20.AccessTokenRequest {
        var _AccessTokenRequest: OAuth20.AccessTokenRequest = new OAuth20.AccessTokenRequest();
        _AccessTokenRequest.client_id = this.client_id;
        _AccessTokenRequest.code = (<OAuth20.AuthorizationResponse>inputMSG).code;
        _AccessTokenRequest.redirect_uri = this.return_uri;
        _AccessTokenRequest.client_secret = this.client_secret;
        return _AccessTokenRequest;
    }

    marshalForCreateAccessTokenRequest(_AccessTokenRequest: OAuth20.AccessTokenRequest) {
        var RawRequestUrl = this.TokenEndpointUrl + "?client_id=" + _AccessTokenRequest.client_id + "&redirect_uri=" + _AccessTokenRequest.redirect_uri
            + "&client_secret=" + _AccessTokenRequest.client_secret + "&code=" + _AccessTokenRequest.code;
        return ({
            url: RawRequestUrl,
            method: "get"
        });
   }

    /*** implementing the three methods for UserProfileRequest ***/
    parseForCreateUserProfileRequest(_raw): CST.CST_MSG {
        var raw = JSON.parse(_raw.body);
        var obj: OAuth20.AccessTokenResponse = new OAuth20.AccessTokenResponse(raw); 
        return obj;
    }

    createUserProfileRequest(inputMSG: CST.CST_MSG): OAuth20.UserProfileRequest {
        var _UserProfileRequest: OAuth20.UserProfileRequest = new OAuth20.UserProfileRequest();
        _UserProfileRequest.access_token = (<OAuth20.AccessTokenResponse>inputMSG).access_token;
        _UserProfileRequest.fields = 'name,email';
        return _UserProfileRequest;
    }

    marshalForCreateUserProfileRequest(_UserProfileRequest: OAuth20.UserProfileRequest) {
        var RawRequestUrl = this.UserProfileUrl + "?access_token=" + _UserProfileRequest.access_token
            + "&fields=" + _UserProfileRequest.fields;
        return ({
            url: RawRequestUrl,
            method: "get"
        });
    }

    parseAndCreateConclusion(_raw): GenericAuth.AuthenticationConclusion {
        var raw = JSON.parse(_raw.body);
        var _FBAuthConclusion = new FBAuthConclusion();
        _FBAuthConclusion.UserID = raw.id;
        _FBAuthConclusion.Email = raw.email;
        _FBAuthConclusion.FB_ID = raw.id;
        _FBAuthConclusion.FullName = raw.name;
        return _FBAuthConclusion;
    }
}
