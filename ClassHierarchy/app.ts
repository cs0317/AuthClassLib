import GenericAuth = require("./GenericAuth");
var msg = new GenericAuth.M1();
msg.Realm = "hello";
console.log(msg.Realm);