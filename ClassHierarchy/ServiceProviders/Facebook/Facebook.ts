
var config = require('../../config');

import OAuth20 = require("../../AuthClassHierarchy/OAuth20");
import GenericAuth = require("../../AuthClassHierarchy/GenericAuth");


export class Facebook_RP extends OAuth20.Client {
    public SignInRP(req: GenericAuth.SignInIdP_Resp_SignInRP_Req): GenericAuth.SignInRP_Resp
    { return null }

    public createAuthorizationRequest() {
        var AuthorizationRequest: OAuth20.AuthorizationRequest = new OAuth20.AuthorizationRequest();
        AuthorizationRequest.client_id = this.client_id;
        AuthorizationRequest.response_type = "token";
        AuthorizationRequest.scope = "user_about_me email";
        AuthorizationRequest.redirect_uri = this.return_uri;
        return AuthorizationRequest;
    }
}
