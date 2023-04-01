"use strict";
exports.__esModule = true;
var jwt = require("jsonwebtoken");
var config_1 = require("../config");
var datastores_1 = require("../datastores");
function ClientVerificationMiddleware(request, response, next) {
    var ACCESS_TOKEN = request.headers.authorization.split(" ")[1];
    var USERNAME = jwt.verify(ACCESS_TOKEN, config_1.JWT_SECRET_KEY);
    datastores_1.UsersStore.findOne({ username: USERNAME }, function (err, user) {
        if (err === null && user !== null) {
            request["username"] = user.username;
            next();
        }
        else
            response.json({ status: "failure", message: "token error" });
    });
}
exports["default"] = ClientVerificationMiddleware;
