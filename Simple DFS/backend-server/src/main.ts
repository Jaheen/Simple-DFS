import * as minimist from "minimist";
import * as crypto from "crypto";
import { DEFAULT_BLOCK_STORAGE_DIRECTORY, DEFAULT_PORT } from "./config";
import { UsersStore } from "./datastores";
import createServer from "./server";

/**
 * Main function that parses the command line args and responses to the commands.
 * This is the entry point of the server.
 *
 * @author Jaheen Afsar Syed
 * @date 28/12/2020
 */
function main() {
   // Command line arguments issued to the server
   const args = minimist(process.argv.slice(2));

   // If block storage location not found in environmental variables then set it up using default settings
   if (process.env.BLOCK_STORAGE_DIRECTORY === undefined)
      if (args.blockStorage)
         process.env.BLOCK_STORAGE_DIRECTORY = args.blockStorage;
      else
         process.env.BLOCK_STORAGE_DIRECTORY = DEFAULT_BLOCK_STORAGE_DIRECTORY;

   // Respond to main command
   switch (args._[0]) {
      case "runserver":
         if (args.port) createServer(args.port);
         else createServer(DEFAULT_PORT);
         break;

      case "createuser":
         if (args.username && args.password) {
            if (args.username.trim() !== "" && args.password.trim() !== "")
               UsersStore.find({ username: args.username }, (err: any, users: string | any[]) => {
                  if (err === null && users.length === 0) {
                     UsersStore.insert({
                        username: args.username,
                        password: crypto.createHash("sha512").update(args.password).digest("base64")
                     })
                     console.log("User created successfully");
                  }
                  else
                     console.log("User already exists")
               })
         }
         else console.log("Please enter both username and password");
         break;

      case "deleteuser":
         if (args.username && args.password)
            if (args.username.trim() !== "" && args.password.trim() !== "")
               UsersStore.remove({ username: args.username })
            else console.log("Please enter both username and password");
         break;

      default:
         console.log("No command found. Please enter a valid command to execute");
         break
   }
}

main();
