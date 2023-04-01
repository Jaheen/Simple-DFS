import { BIGINT, TEXT, INTEGER } from "sequelize";
import DatabaseManager from "../database-manager";

const Servers = DatabaseManager.getDatabaseConnection().define("Servers", {
    serverID: {
        type: BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    serverName: {
        type: TEXT
    },
    serverAddress: {
        type: TEXT,
        allowNull: false
    },
    portNumber: {
        type: INTEGER,
        allowNull: false
    },
    accessToken: {
        type: TEXT,
        allowNull: false
    }
})

export default Servers
