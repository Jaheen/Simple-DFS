"use strict";
exports.__esModule = true;
exports.IS_DISK_HEALTHY = exports.DISK_SPEEDS = exports.NEDB_ENCRYPTION_SECRET = exports.JWT_SECRET_KEY = exports.DEFAULT_BLOCK_STORAGE_DIRECTORY = exports.DEFAULT_PORT = exports.DATABASE_LOCATION = void 0;
var os_1 = require("os");
exports.DATABASE_LOCATION = os_1.homedir() + "/.Simple-DFS/database";
exports.DEFAULT_PORT = 6789;
exports.DEFAULT_BLOCK_STORAGE_DIRECTORY = "./data/blocks";
exports.JWT_SECRET_KEY = "J7Zq5OEPIJQ,<[~utgBa.2{cmcH6<6";
exports.NEDB_ENCRYPTION_SECRET = 'B6DFB1D7FEC3AF6187BEF3CD2A931';
exports.DISK_SPEEDS = {};
exports.IS_DISK_HEALTHY = true;