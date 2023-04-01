import { Sequelize } from "sequelize";
import { DATABASE_DIR } from "../config";

/**
 * This class contains the singleton instance of the database connection object
 */
export default class DatabaseManager {
    static DATABASE_CONNECTION: Sequelize = new Sequelize({
        dialect: "sqlite",
        storage: `${DATABASE_DIR}/data.db`
    })

    static getDatabaseConnection(): Sequelize {
        return this.DATABASE_CONNECTION
    }
}
