import * as checkDiskSpace from "check-disk-space";
import { Request, Response, Router } from "express";
import { resolve } from "path";

/**
 * Router for URLs with prefix /getInfo/*
 */
const infoRouter = Router();

/**
 * GET request to get free space in this server
 */
infoRouter.get("/serverStorage", (req: Request, res: Response) => {
   checkDiskSpace(resolve(process.env.BLOCK_STORAGE_DIRECTORY))
      .then(result => {
         res.json({
            freeSpace: Math.floor(result.free / (1000 * 1000)),
            usedSpace: Math.floor((result.size - result.free) / (1000 * 1000)),
            unit: "MB",
         });
      })
      .catch(err => res.json({ message: "Error getting info", err }))
});

export default infoRouter;
