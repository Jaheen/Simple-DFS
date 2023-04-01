import { BIGINT } from "sequelize";
import { BOOLEAN } from "sequelize";
import { TEXT } from "sequelize";
import DatabaseManager from "../database-manager";

const Folders = DatabaseManager.getDatabaseConnection().define("Folders", {
    folderID: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    folderName: {
        type: TEXT
    },
    parentFolderID: {
        type: BIGINT,
        allowNull: false
    },
    isReplica: {
        type: BOOLEAN,
        defaultValue: false
    },
    replicaOf: {
        type: BIGINT
    }
})

export default Folders
