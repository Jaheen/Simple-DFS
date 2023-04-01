import { BIGINT, TEXT } from "sequelize";
import DatabaseManager from "../database-manager";

const Blocks = DatabaseManager.getDatabaseConnection().define("Blocks", {
    blockID: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    blockName: {
        type: TEXT,
        allowNull: false
    },
    associatedFile: {
        type: BIGINT,
        references: {
            model: "Files",
            key: "fileID"
        }
    },
    associatedServer: {
        type: BIGINT,
        references: {
            model: "Servers",
            key: "serverID"
        }
    }
})

export default Blocks
