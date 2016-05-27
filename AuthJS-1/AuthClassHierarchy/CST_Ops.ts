var StackTrace = require('stacktrace-js');
var crypto = require('crypto');
var TsTypeInfo = require('ts-type-info');

import {CST_MSG} from "./CST";
import {Message} from "./Message";

export class CST_Ops {
    static GetRootClassName(o: Object): string {
        let t = Object.getPrototypeOf(o);
        let base: string = "";
        let count: number = 1;
        while (1) {
            if (t.constructor.name === "Object") { break; }
            base = t.constructor.name;
            t = Object.getPrototypeOf(t);
        }
        return base;
    }

    public static recordme(o: Object, in_msg: CST_MSG, out_msg: CST_MSG) {
        let rootClass = this.GetRootClassName(o);
        let currClass = Object.getPrototypeOf(o).constructor.name;

        var callback = function(stackFrames) {
            CST_Ops._recordme(rootClass, currClass, stackFrames[1], in_msg, out_msg);
        };

        StackTrace.get().then(callback);
    }

    static _recordme(rootClass: string, currClass: string, currFrame: StackTrace.StackFrame, in_msg: CST_MSG, out_msg: CST_MSG) {

        let fileName = currFrame.fileName.replace(".js", ".ts");
        const result = TsTypeInfo.getInfoFromFiles([fileName]);
        let property = result.getFile(fileName);
        let classInfo = property.getClass(currClass);
        let functionName = currFrame.functionName.split(".").slice(-1)[0]; // Class.method => method
        let funcInfo = classInfo.getMethod(functionName);
        let args = [];
        for (var i in funcInfo.parameters) {
            let arg = funcInfo.parameters[i];
            args.push(arg.typeExpression.text);
        }

        let returnType = funcInfo.returnTypeExpression.text;

        let methodKey = `${fileName} ${rootClass} ${currClass} ${functionName} ${args} ${returnType}`;
        let hash = crypto
            .createHash('sha256')
            .update(methodKey)
            .digest('hex');
        console.log(`methodKey: ${methodKey}\nhash: ${hash}`);
    }
}
