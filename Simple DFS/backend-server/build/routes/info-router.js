"use strict";
exports.__esModule = true;
var checkDiskSpace = require("check-disk-space");
var express_1 = require("express");
var path_1 = require("path");
var infoRouter = express_1.Router();
infoRouter.get("/serverStorage", function (req, res) {
    checkDiskSpace(path_1.resolve(process.env.BLOCK_STORAGE_DIRECTORY))
        .then(function (result) {
        res.json({
            freeSpace: Math.floor(result.free / (1000 * 1000)),
            usedSpace: Math.floor((result.size - result.free) / (1000 * 1000)),
            unit: "MB"
        });
    })["catch"](function (err) { return res.json({ message: "Error getting info", err: err }); });
});
exports["default"] = infoRouter;
