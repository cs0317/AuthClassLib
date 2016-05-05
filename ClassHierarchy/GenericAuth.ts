import CST = require("./CST");
export abstract class SignInIdP_Req extends CST.CST_MSG {
    IdPSessionSecret: string;
    get Realm(): string { return null };
    set Realm(value: string) { };
    constructor() { super("test_symT", "shuo"); };
}
export class M1 extends SignInIdP_Req {
    IdPSessionSecret: string;
    get Realm(): string { return "M1"; };
    set Realm(value: string) { console.log(value); };
    constructor() { super(); };
}