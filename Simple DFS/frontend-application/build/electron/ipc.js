"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.IPCMainHandlers = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var form_data_1 = __importDefault(require("form-data"));
var crypto = __importStar(require("crypto"));
var electron_1 = require("electron");
var servers_1 = __importDefault(require("../database/models/servers"));
var axios_1 = __importDefault(require("axios"));
var files_1 = __importDefault(require("../database/models/files"));
var blocks_1 = __importDefault(require("../database/models/blocks"));
exports.IPCMainHandlers = (electron_1.ipcMain.on("UPLOAD_FILE_TO_SERVER", function (event, filepath, serverID, parentFolderID) {
    servers_1["default"].findOne({ where: { serverID: serverID } }).then(function (server) {
        if (server) {
            var readStream = fs.createReadStream(filepath, { highWaterMark: 1000000 });
            var fileHash_1 = crypto.createHash("sha512");
            var formData_1 = new form_data_1["default"]();
            readStream.on("data", function (chunk) {
                fileHash_1.update(chunk);
                formData_1.append("block", chunk, {
                    filename: crypto.createHash("md5").update(chunk).digest("base64")
                });
            });
            readStream.once("end", function () {
                axios_1["default"].post("http://" + server.get("serverAddress") + ":" + server.get("portNumber") + "/storage/uploadBlocks", formData_1, {
                    headers: __assign(__assign({}, formData_1.getHeaders()), { Authorization: "Bearer " + server.get("accessToken") }),
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                }).then(function (response) {
                    if (response.status === 200) {
                        files_1["default"].create({
                            fileName: filepath.split("/").slice(-1)[0],
                            hash: fileHash_1.digest("base64"),
                            parentFolderID: parentFolderID
                        }).then(function (file) {
                            response.data.uploadedBlocks.forEach(function (block) {
                                blocks_1["default"].create({
                                    blockName: block,
                                    associatedFile: file.get("fileID"),
                                    associatedServer: serverID
                                });
                            });
                            event.sender.send("FILE_UPLOADED");
                        });
                    }
                });
            });
        }
    });
}),
    electron_1.ipcMain.on("DOWNLOAD_FILE_FROM_SERVER", function (event, destination, fileID, fileName) {
        var writeStream = fs.createWriteStream(path.join(destination, fileName));
        var blockIdentifiers = [];
        var serverIDs = [];
        blocks_1["default"].findAll({ where: { associatedFile: fileID } }).then(function (blocks) {
            blocks.forEach(function (block) {
                blockIdentifiers.push(block.get("blockName"));
                if (!serverIDs.includes(block.get("associatedServer"))) {
                    serverIDs.push(block.get("associatedServer"));
                }
            });
            servers_1["default"].findOne({ where: { serverID: serverIDs[0] } }).then(function (server) {
                if (server)
                    axios_1["default"].get("http://" + server.get("serverAddress") + ":" + server.get("portNumber") + "/storage/getBlocks/" + JSON.stringify(blockIdentifiers), {
                        responseType: "stream",
                        headers: {
                            Authorization: "Bearer " + server.get("accessToken")
                        }
                    }).then(function (response) {
                        response.data.pipe(writeStream);
                        writeStream.once("finish", function () {
                            event.sender.send("FILE_DOWNLOADED");
                        });
                    });
            });
        });
    }),
    electron_1.ipcMain.on("DELETE_FILE_FROM_SERVER", function (event, fileID) {
        var blockIdentifiers = [];
        var serverIDs = [];
        blocks_1["default"].findAll({ where: { associatedFile: fileID } }).then(function (blocks) {
            blocks.forEach(function (block) {
                blockIdentifiers.push(block.get("blockName"));
                if (!serverIDs.includes(block.get("associatedServer"))) {
                    serverIDs.push(block.get("associatedServer"));
                }
            });
            servers_1["default"].findOne({ where: { serverID: serverIDs[0] } }).then(function (server) {
                if (server)
                    axios_1["default"]["delete"]("http://" + server.get("serverAddress") + ":" + server.get("portNumber") + "/storage/deleteBlocks/" + JSON.stringify(blockIdentifiers), {
                        responseType: "stream",
                        headers: {
                            Authorization: "Bearer " + server.get("accessToken")
                        }
                    }).then(function (response) {
                        blocks_1["default"].destroy({ where: { associatedFile: fileID } }).then(function () {
                            files_1["default"].destroy({ where: { fileID: fileID } }).then(function () {
                                event.sender.send("FILE_DELETED", fileID);
                            });
                        });
                    });
            });
        });
    }));
