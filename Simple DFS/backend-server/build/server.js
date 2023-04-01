"use strict";
exports.__esModule = true;
var express = require("express");
var http = require("http");
var body_parser_1 = require("body-parser");
var auth_router_1 = require("./routes/auth-router");
var info_router_1 = require("./routes/info-router");
var storage_router_1 = require("./routes/storage-router");
var setup_1 = require("./setup");
function createServer(port) {
    var application = express();
    var httpServer = http.createServer(application);
    setup_1.setup();
    application.use(body_parser_1.json());
    application.use("/getInfo", info_router_1["default"]);
    application.use("/storage", storage_router_1["default"]);
    application.use("/auth", auth_router_1["default"]);
    httpServer.listen(port, function () { return console.log("Server Started on port " + port); });
}
exports["default"] = createServer;
