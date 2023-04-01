"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var database_manager_1 = __importDefault(require("../database-manager"));
var Blocks = database_manager_1["default"].getDatabaseConnection().define("Blocks", {
    blockID: {
        type: sequelize_1.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    blockName: {
        type: sequelize_1.TEXT,
        allowNull: false
    },
    associatedFile: {
        type: sequelize_1.BIGINT,
        references: {
            model: "Files",
            key: "fileID"
        }
    },
    associatedServer: {
        type: sequelize_1.BIGINT,
        references: {
            model: "Servers",
            key: "serverID"
        }
    }
});
exports["default"] = Blocks;
