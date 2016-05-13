import CST = require("./CST");

/***********************************************************/
/*               Messages between parties                  */
/***********************************************************/
export abstract class SignInIdP_Req extends CST.CST_MSG {
    IdPSessionSecret: string;
    get Realm(): string { throw new TypeError("getRealm is not implemented");  };
    set Realm(value: string) { throw new TypeError("setRealm is not implemented"); };
}

export abstract class SignInIdP_Resp_SignInRP_Req extends CST.CST_MSG {
}

export abstract class SignInRP_Resp extends CST.CST_MSG {
}

/***********************************************************/
/*               Data structures on parties                */
/***********************************************************/

export abstract class ID_Claim {
    get UserID(): string { throw new TypeError("getUserID is not implemented"); };
    get Redir_dest(): string { throw new TypeError("getRedir_dest is not implemented"); };
}

export interface IdPAuthRecords_Base {
     getEntry(IdPSessionSecret: string, Realm: string ): ID_Claim;
     setEntry(IdPSessionSecret: string , Realm: string ,  _ID_Claim: ID_Claim):boolean;
}

/***********************************************************/
/*                          Parties                        */
/***********************************************************/
/*         AS stands for Authority Server                  */
/*         AS is both IdP and Authorization Server         */
/***********************************************************/

export abstract class AS {
    IdentityRecords: IdPAuthRecords_Base ;
    
    SignInIdP(req: SignInIdP_Req ): SignInIdP_Resp_SignInRP_Req  {
        GlobalObjects_base.SignInIdP_Req = req;

        if (req == null) return null;
        let _ID_Claim : ID_Claim = this.Process_SignInIdP_req(req);
        if (this.IdentityRecords.setEntry(req.IdPSessionSecret, req.Realm, _ID_Claim) == false)
            return null;
        return this.Redir(_ID_Claim.Redir_dest, _ID_Claim);
    }

    abstract Process_SignInIdP_req(req: SignInIdP_Req ): ID_Claim ;
    abstract Redir(dest:string , _ID_Claim: ID_Claim ): SignInIdP_Resp_SignInRP_Req ;
}

export class AuthenticationConclusion extends CST.CST_MSG {
    UserID: string;
}

export abstract class RP {
    get Domain(): string { throw new TypeError("getDomain is not implemented"); };
    set Domain(value: string) { throw new TypeError("setDomain is not implemented"); };
    get Realm(): string { throw new TypeError("getRealm is not implemented"); };
    set Realm(value: string) { throw new TypeError("setRealm is not implemented"); };
    public AuthenticationDone(conclusion: AuthenticationConclusion): boolean {
      //  bool CST_verified = CST_Ops.Certify(conclusion);
/*
        if (CurrentSession["UserID"] != null)
            CurrentSession["UserID"] = CST_verified ? conclusion.SessionUID : "";
        else
            CurrentSession.Add("UserID", CST_verified ? conclusion.SessionUID : "");
        return CST_verified;*/
        return true;
    }
}


/****************************************************************/
/* The definition of the "Authentication/Authorization" problem */
/****************************************************************/
export class GlobalObjects_base {
    public static SignInIdP_Req: SignInIdP_Req;
    public static  AS : AS;
    public static  RP : RP;

    public static  BadPersonCannotSignInAsGoodPerson(conclusion: AuthenticationConclusion ): void {
        let ID_claim: ID_Claim = this.AS.IdentityRecords.getEntry(
                                    this.SignInIdP_Req.IdPSessionSecret,
                                    this.RP.Realm);
       // Contract.Assert(ID_claim.Redir_dest == this.RP.Domain && ID_claim.UserID == conclusion.SessionUID);
    }
}