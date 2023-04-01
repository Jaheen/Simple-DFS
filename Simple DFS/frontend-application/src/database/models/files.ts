import { BOOLEAN } from "sequelize"
import { BIGINT, STRING, TEXT } from "sequelize"
import DatabaseManager from "../database-manager"

const Files = DatabaseManager.getDatabaseConnection().define("Files", {
    fileID: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    fileName: {
        type: STRING,
        allowNull: false
    },
    parentFolderID: {
        type: BIGINT,
        references: {
            model: "Folders",
            key: "folderID"
        }
    },
    hash: {
        type: TEXT,
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

export default Files
