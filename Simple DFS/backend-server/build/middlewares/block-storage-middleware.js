"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var multer = require("multer");
var BlockStorage = multer.diskStorage({
    filename: function (req, file, callback) {
        if (req["uploadedBlocks"] === undefined)
            req["uploadedBlocks"] = [file.originalname];
        else
            req["uploadedBlocks"].push(file.originalname);
        callback(null, file.originalname);
    },
    destination: function (req, file, callback) {
        if (!fs_1.existsSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"]))
            fs_1.mkdirSync(process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"], { recursive: true });
        callback(null, process.env.BLOCK_STORAGE_DIRECTORY + "/" + req["username"]);
    }
});
var BlockStorageMiddleware = multer({ storage: BlockStorage }).any();
exports["default"] = BlockStorageMiddleware;
