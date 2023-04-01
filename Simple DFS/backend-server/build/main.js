"use strict";
exports.__esModule = true;
var minimist = require("minimist");
var crypto = require("crypto");
var config_1 = require("./config");
var datastores_1 = require("./datastores");
var server_1 = require("./server");
function main() {
    var args = minimist(process.argv.slice(2));
    if (process.env.BLOCK_STORAGE_DIRECTORY === undefined)
        if (args.blockStorage)
            process.env.BLOCK_STORAGE_DIRECTORY = args.blockStorage;
        else
            process.env.BLOCK_STORAGE_DIRECTORY = config_1.DEFAULT_BLOCK_STORAGE_DIRECTORY;
    switch (args._[0]) {
        case "runserver":
            if (args.port)
                server_1["default"](args.port);
            else
                server_1["default"](config_1.DEFAULT_PORT);
            break;
        case "createuser":
            if (args.username && args.password) {
                if (args.username.trim() !== "" && args.password.trim() !== "")
                    datastores_1.UsersStore.find({ username: args.username }, function (err, users) {
                        if (err === null && users.length === 0) {
                            datastores_1.UsersStore.insert({
                                username: args.username,
                                password: crypto.createHash("sha512").update(args.password).digest("base64")
                            });
                            console.log("User created successfully");
                        }
                        else
                            console.log("User already exists");
                    });
            }
            else
                console.log("Please enter both username and password");
            break;
        case "deleteuser":
            if (args.username && args.password)
                if (args.username.trim() !== "" && args.password.trim() !== "")
                    datastores_1.UsersStore.remove({ username: args.username });
                else
                    console.log("Please enter both username and password");
            break;
        default:
            console.log("No command found. Please enter a valid command to execute");
            break;
    }
}
main();
