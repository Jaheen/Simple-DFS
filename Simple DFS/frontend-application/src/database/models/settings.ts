import { TEXT } from "sequelize";
import DatabaseManager from "../database-manager";

const Settings = DatabaseManager.getDatabaseConnection().define("Settings", {
    name: {
        type: TEXT,
        primaryKey: true
    },
    value: {
        type: TEXT,
        allowNull: false
    }
})

export default Settings
