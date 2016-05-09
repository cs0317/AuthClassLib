import GenericAuth = require("./GenericAuth");
var msg = new GenericAuth.M1(); 
msg.Realm = "hello1";
console.log(msg.Realm);