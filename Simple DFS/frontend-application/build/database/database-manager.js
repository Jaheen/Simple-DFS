"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var config_1 = require("../config");
var DatabaseManager = (function () {
    function DatabaseManager() {
    }
    DatabaseManager.getDatabaseConnection = function () {
        return this.DATABASE_CONNECTION;
    };
    DatabaseManager.DATABASE_CONNECTION = new sequelize_1.Sequelize({
        dialect: "sqlite",
        storage: config_1.DATABASE_DIR + "/data.db"
    });
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
