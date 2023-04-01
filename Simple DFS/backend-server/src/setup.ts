import { existsSync, mkdirSync, } from "fs";
import { DATABASE_LOCATION } from "./config";

/**
 * Initial setup to sync server settings
 */
export async function setup() {
   if (DATABASE_LOCATION)
      if (!existsSync(DATABASE_LOCATION))
         mkdirSync(DATABASE_LOCATION, { recursive: true });

   if (process.env.BLOCK_STORAGE_DIRECTORY)
      if (!existsSync(process.env.BLOCK_STORAGE_DIRECTORY))
         mkdirSync(process.env.BLOCK_STORAGE_DIRECTORY, { recursive: true });
}
