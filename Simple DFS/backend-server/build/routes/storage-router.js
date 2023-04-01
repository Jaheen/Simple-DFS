"use strict";
exports.__esModule = true;
var express_1 = require("express");
var fs_1 = require("fs");
var block_storage_middleware_1 = require("../middlewares/block-storage-middleware");
var client_verification_middleware_1 = require("../middlewares/client-verification-middleware");
var storageRouter = express_1.Router();
storageRouter.use(client_verification_middleware_1["default"]);
storageRouter.post("/uploadBlocks", block_storage_middleware_1["default"], function (req, res) {
    res.json({
        isUploadSuccess: true,
        uploadedBlocks: req["uploadedBlocks"]
    });
});
storageRouter.get("/getBlocks/:blockIdentifiers", function (req, res) {
    JSON.parse(req.params.blockIdentifiers).forEach(function (identifier) {
        if (fs_1.existsSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"] + "/" + identifier)) {
            res.write(fs_1.readFileSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"] + "/" + identifier));
        }
    });
    res.end();
});
storageRouter["delete"]("/deleteBlocks/:blockIdentifiers", function (req, res) {
    JSON.parse(req.params.blockIdentifiers).forEach(function (identifier) {
        if (fs_1.existsSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"] + "/" + identifier)) {
            fs_1.unlinkSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"] + "/" + identifier);
        }
    });
    res.json({
        status: "success",
        message: "blocks deleted successfully"
    });
});
exports["default"] = storageRouter;
