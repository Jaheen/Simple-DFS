import * as fs from "fs";
import * as path from "path";
import FormData from "form-data";
import * as crypto from "crypto";
import { ipcMain } from "electron";
import Servers from "../database/models/servers";
import axios from "axios";
import Files from "../database/models/files";
import Blocks from "../database/models/blocks";

export const IPCMainHandlers = (
    ipcMain.on("UPLOAD_FILE_TO_SERVER", (event, filepath: string, serverID: number, parentFolderID: number) => {
        Servers.findOne({ where: { serverID } }).then(server => {
            if (server) {
                const readStream = fs.createReadStream(filepath, { highWaterMark: 1000000 })
                const fileHash = crypto.createHash("sha512")
                const formData = new FormData()
                readStream.on("data", chunk => {
                    fileHash.update(chunk)
                    formData.append("block", chunk, {
                        filename: crypto.createHash("md5").update(chunk).digest("base64")
                    })
                })
                readStream.once("end", () => {
                    axios.post(`http://${server.get("serverAddress")}:${server.get("portNumber")}/storage/uploadBlocks`, formData, {
                        headers: { ...formData.getHeaders(), Authorization: `Bearer ${server.get("accessToken")}` },
                        maxBodyLength: Infinity,
                        maxContentLength: Infinity
                    }).then(response => {
                        if (response.status === 200) {
                            Files.create({
                                fileName: filepath.split("/").slice(-1)[0],
                                hash: fileHash.digest("base64"),
                                parentFolderID
                            }).then(file => {
                                response.data.uploadedBlocks.forEach((block: any) => {
                                    Blocks.create({
                                        blockName: block,
                                        associatedFile: file.get("fileID"),
                                        associatedServer: serverID
                                    })
                                })
                                event.sender.send("FILE_UPLOADED")
                            })
                        }
                    })
                })
            }
        })
    }),
    ipcMain.on("DOWNLOAD_FILE_FROM_SERVER", (event, destination: string, fileID: number, fileName: string) => {
        const writeStream = fs.createWriteStream(path.join(destination, fileName))
        const blockIdentifiers: unknown[] = []
        const serverIDs: unknown[] = []
        Blocks.findAll({ where: { associatedFile: fileID } }).then(blocks => {
            blocks.forEach(block => {
                blockIdentifiers.push(block.get("blockName"))
                if (!serverIDs.includes(block.get("associatedServer"))) {
                    serverIDs.push(block.get("associatedServer"))
                }
            })
            Servers.findOne({ where: { serverID: serverIDs[0] } }).then(server => {
                if (server)
                    axios.get(`http://${server.get("serverAddress")}:${server.get("portNumber")}/storage/getBlocks/${JSON.stringify(blockIdentifiers)}`, {
                        responseType: "stream",
                        headers: {
                            Authorization: `Bearer ${server.get("accessToken")}`
                        }
                    }).then(response => {
                        response.data.pipe(writeStream);
                        writeStream.once("finish", () => {
                            event.sender.send("FILE_DOWNLOADED")
                        })
                    })
            })
        })
    }),
    ipcMain.on("DELETE_FILE_FROM_SERVER", (event, fileID: number) => {
        const blockIdentifiers: unknown[] = []
        const serverIDs: unknown[] = []
        Blocks.findAll({ where: { associatedFile: fileID } }).then(blocks => {
            blocks.forEach(block => {
                blockIdentifiers.push(block.get("blockName"))
                if (!serverIDs.includes(block.get("associatedServer"))) {
                    serverIDs.push(block.get("associatedServer"))
                }
            })
            Servers.findOne({ where: { serverID: serverIDs[0] } }).then(server => {
                if (server)
                    axios.delete(`http://${server.get("serverAddress")}:${server.get("portNumber")}/storage/deleteBlocks/${JSON.stringify(blockIdentifiers)}`, {
                        responseType: "stream",
                        headers: {
                            Authorization: `Bearer ${server.get("accessToken")}`
                        }
                    }).then(response => {
                        Blocks.destroy({ where: { associatedFile: fileID } }).then(() => {
                            Files.destroy({ where: { fileID } }).then(() => {
                                event.sender.send("FILE_DELETED", fileID)
                            })
                        })
                    })
            })
        })
    })
)
