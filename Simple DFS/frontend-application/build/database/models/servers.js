"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var database_manager_1 = __importDefault(require("../database-manager"));
var Servers = database_manager_1["default"].getDatabaseConnection().define("Servers", {
    serverID: {
        type: sequelize_1.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    serverName: {
        type: sequelize_1.TEXT
    },
    serverAddress: {
        type: sequelize_1.TEXT,
        allowNull: false
    },
    portNumber: {
        type: sequelize_1.INTEGER,
        allowNull: false
    },
    accessToken: {
        type: sequelize_1.TEXT,
        allowNull: false
    }
});
exports["default"] = Servers;
