import { existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { DATABASE_DIR } from "./config";
import DatabaseManager from "./database/database-manager";
import Files from "./database/models/files";
import Blocks from "./database/models/blocks";
import Folders from "./database/models/folders";
import Servers from "./database/models/servers";
import Settings from "./database/models/settings";

/**
 * Make initial setup during first start
 */
export default function setup() {
    if (!existsSync(DATABASE_DIR)) {
        mkdirSync(DATABASE_DIR, { recursive: true })
        DatabaseManager.getDatabaseConnection()
            .authenticate()
            .then(() => {
                Servers.sync()
                Folders.sync().then(() => {
                    Folders.create({
                        folderID: 1,
                        folderName: "root",
                        parentFolderID: 0
                    })
                })
                Files.sync()
                Blocks.sync()
                Settings.sync().then(() => {
                    Settings.bulkCreate([
                        {
                            name: "Username",
                            value: "Administrator"
                        },
                        {
                            name: "Password",
                            value: createHash("sha512").update("Administrator").digest("base64")
                        }
                    ])
                })
            })
            .catch(console.log)
    }
}
