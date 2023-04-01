"use strict";
exports.__esModule = true;
var express_1 = require("express");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config_1 = require("../config");
var datastores_1 = require("../datastores");
var authRouter = express_1.Router();
authRouter.post("/login", function (req, res) {
    var USERNAME = req.body.username;
    var PASSWORD = req.body.password;
    if (USERNAME && PASSWORD)
        if (USERNAME.trim() !== "" && PASSWORD.trim() !== "") {
            datastores_1.UsersStore.findOne({ username: USERNAME }, function (err, user) {
                if (!err)
                    if (user !== null)
                        if (user.password === crypto.createHash("sha512").update(PASSWORD).digest("base64"))
                            res.json({
                                result: "success",
                                token: jwt.sign(USERNAME, config_1.JWT_SECRET_KEY)
                            });
                        else
                            res.json({
                                result: "failure",
                                message: "password mismatch"
                            });
                    else
                        res.json({
                            result: "failure",
                            message: "user not found"
                        });
                else
                    res.json({
                        result: "failure",
                        message: "unable to process",
                        err: err
                    });
            });
        }
});
exports["default"] = authRouter;
