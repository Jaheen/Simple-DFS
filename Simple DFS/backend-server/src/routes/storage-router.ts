import { Request, Response, Router } from "express";
import { existsSync, readFileSync, unlinkSync } from "fs";
import BlockStorageMiddleware from "../middlewares/block-storage-middleware";
import ClientVerificationMiddleware from "../middlewares/client-verification-middleware";

/**
 * Router for URLs with prefix /storage/
 */
const storageRouter = Router();

/**
 * Verify credentials middleware
 */
storageRouter.use(ClientVerificationMiddleware)

/**
 * Upload blocks sent from client
 */
storageRouter.post("/uploadBlocks", BlockStorageMiddleware, (req: Request, res: Response) => {
   res.json({
      isUploadSuccess: true,
      uploadedBlocks: req["uploadedBlocks"],
   });
});

/**
 * Read all blocks and return to the client
 */
storageRouter.get("/getBlocks/:blockIdentifiers", (req: Request, res: Response) => {
   JSON.parse(req.params.blockIdentifiers).forEach((identifier: string) => {
      if (existsSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}/${identifier}`)) {
         res.write(
            readFileSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}/${identifier}`)
         );
      }
   });
   res.end();
});

/**
 * Delete blocks with respective block identifiers
 */
storageRouter.delete("/deleteBlocks/:blockIdentifiers", (req: Request, res: Response) => {
   JSON.parse(req.params.blockIdentifiers).forEach((identifier: string) => {
      if (existsSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}/${identifier}`)) {
         unlinkSync(`${process.env.BLOCK_STORAGE_DIRECTORY}/${req["username"]}/${identifier}`)
      }
   });
   res.json({
      status: "success",
      message: "blocks deleted successfully"
   })
});

export default storageRouter;
