"use strict";
exports.__esModule = true;
exports.DATABASE_DIR = exports.APP_DIR = void 0;
var os_1 = require("os");
exports.APP_DIR = os_1.homedir() + "/.Simple-DFS-Client";
exports.DATABASE_DIR = exports.APP_DIR + "/database";
