
    export class CST_MSG {
        SymT: string = "";
        SignedBy: string = "";
        constructor(SymT: string, SignedBy: string) {
            this.SymT = SymT;
            this.SignedBy = SignedBy;
        }

    }

    export class Debug {
        static reached(): void {
            console.log("Debug.reached()");
        }
    }

    export interface Nondet_Base {
        Int(): number;
        String(): string;
        Bool(): boolean;
    }
