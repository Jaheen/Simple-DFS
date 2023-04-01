"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var sequelize_2 = require("sequelize");
var database_manager_1 = __importDefault(require("../database-manager"));
var Files = database_manager_1["default"].getDatabaseConnection().define("Files", {
    fileID: {
        type: sequelize_2.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    fileName: {
        type: sequelize_2.STRING,
        allowNull: false
    },
    parentFolderID: {
        type: sequelize_2.BIGINT,
        references: {
            model: "Folders",
            key: "folderID"
        }
    },
    hash: {
        type: sequelize_2.TEXT,
        allowNull: false
    },
    isReplica: {
        type: sequelize_1.BOOLEAN,
        defaultValue: false
    },
    replicaOf: {
        type: sequelize_2.BIGINT
    }
});
exports["default"] = Files;
