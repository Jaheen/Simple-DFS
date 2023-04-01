"use strict";
exports.__esModule = true;
exports.UsersStore = void 0;
var DataStore = require("nedb");
var crypto = require("crypto");
var config_1 = require("../config");
var NEDB_ENCRYPTION_KEY = crypto.createHash("sha512")
    .update(config_1.NEDB_ENCRYPTION_SECRET)
    .digest("base64")
    .substr(0, 32);
exports.UsersStore = new DataStore({
    filename: config_1.DATABASE_LOCATION + "/Users.db",
    autoload: true,
    afterSerialization: function (plaintext) {
        var iv = crypto.randomBytes(16);
        var aes = crypto.createCipheriv("aes-256-cbc", NEDB_ENCRYPTION_KEY, iv);
        var ciphertext = aes.update(plaintext);
        ciphertext = Buffer.concat([iv, ciphertext, aes.final()]);
        return ciphertext.toString('base64');
    },
    beforeDeserialization: function (ciphertext) {
        var ciphertextBytes = Buffer.from(ciphertext, 'base64');
        var iv = ciphertextBytes.slice(0, 16);
        var data = ciphertextBytes.slice(16);
        var aes = crypto.createDecipheriv("aes-256-cbc", NEDB_ENCRYPTION_KEY, iv);
        var plaintextBytes = Buffer.from(aes.update(data));
        plaintextBytes = Buffer.concat([plaintextBytes, aes.final()]);
        return plaintextBytes.toString();
    }
});
