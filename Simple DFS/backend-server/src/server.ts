import * as express from "express";
import * as http from "http";
import { json } from "body-parser";
import AuthRouter from "./routes/auth-router";
import InfoRouter from "./routes/info-router";
import StorageRouter from "./routes/storage-router";
import { setup } from "./setup";

/**
 * Create and start the HTTP Server with the provided PORT Number or default 6789 port.
 * @param {Number} port port number on which the server should run
 */
export default function createServer(port: Number) {
   const application = express();
   const httpServer = http.createServer(application);

   // Perform Initial Setup to ensure smooth performance
   setup();

   // JSON Parsing middleware
   application.use(json())
   // Add routers for specific prefixes
   application.use("/getInfo", InfoRouter);
   application.use("/storage", StorageRouter);
   application.use("/auth", AuthRouter);

   httpServer.listen(port, () => console.log(`Server Started on port ${port}`));
}