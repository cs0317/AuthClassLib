import GenericAuth = require("./GenericAuth");

var request = require('../../../Auth.JS/node_modules/request'); //I don't understand why "var" cannot be replaced by "import"
var msg = new GenericAuth.M1(); 
msg.Realm = "hello1";
console.log(msg.Realm);