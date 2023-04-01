import { existsSync, mkdirSync } from "fs";
import * as multer from "multer";

/**
 * Custom Block Storage for uploaded blocks
 */
const BlockStorage = multer.diskStorage({
   filename: (req, file, callback) => {
      if (req["uploadedBlocks"] === undefined)
         req["uploadedBlocks"] = [file.originalname];
      else req["uploadedBlocks"].push(file.originalname);
      callback(null, file.originalname);
   },
   destination: (req, file, callback) => {
      if (!existsSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}`))
         mkdirSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}`, { recursive: true })
      callback(null, `${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}`);
   },
});

/**
 * Middleware for handling multipart form data
 */
const BlockStorageMiddleware = multer({ storage: BlockStorage }).any();

export default BlockStorageMiddleware;
