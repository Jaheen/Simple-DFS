import { remote } from "electron"
import * as fs from "fs"
import { Button, Dialog, Grid, TextField } from '@material-ui/core'
import React, { Component } from 'react'
import styled from 'styled-components'
import FoldersTable from '../../../database/models/folders'
import FilesTable from "../../../database/models/files"
import FileItem from './FileItem'
import FolderItem from './Foldertem'
import Topbar from './Topbar'
import { AppContext } from "../../../contexts"
import { AppContext as AppContextType } from "../../../types"
import { ipcRenderer } from "electron"

const WrapperGrid = styled(Grid)`
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
`
const Title = styled.p`
    width: 100%;
    height: fit-content;
    font-size: 25px;
    padding: .5em;
`
const ActionButton = styled(Button)`
    background-color: #28C0F8 !important;
    color: white !important;
    margin: 1em !important;
`
const CreateFolderDialogContainer = styled(Grid)`
    padding: 1em;
    & > * {
        margin: 0 .5em !important;
    }
`

interface FolderInfo {
    folderID: number
    folderName: string
    parentFolderID: number
}
interface FileInfo {
    fileID: number
    fileName: string
    parentFolderID: number
}
interface FilesComponentState {
    createFolderDialogOpen: boolean
    folders: Array<FolderInfo>
    files: Array<FileInfo>
}
/**
 * Files Component which lists all the folders and files in a selected directory
 */
export default class Files extends Component<{}, FilesComponentState> {
    // Initilize refs
    folderNameRef: React.RefObject<HTMLInputElement>
    navigationHistoryStack: Array<number>

    /**
     * Constructor for the component
     * @param props props passed to this component
     */
    constructor(props: any) {
        super(props)
        this.state = {
            createFolderDialogOpen: false,
            folders: [],
            files: []
        }
        this.navigationHistoryStack = [1]
        this.navigateForward = this.navigateForward.bind(this)
        this.createFolder = this.createFolder.bind(this)
        this.updateCurrentFolder = this.updateCurrentFolder.bind(this)
        this.navigateBackward = this.navigateBackward.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.folderNameRef = React.createRef()
    }

    /**
     * Retrieve folders and files from the database and display to the user
     * If folder ID provided get all direct child directories and files and update the state
     * else get the last folder ID from the history
     * @param folderID ID of the folder whose folders and files should be listed
     */
    updateCurrentFolder(folderID?: number) {
        if (!folderID)
            folderID = this.navigationHistoryStack[this.navigationHistoryStack.length - 1]
        FoldersTable.findAll({ where: { parentFolderID: folderID } }).then(folders => {
            const foldersList: Array<FolderInfo> = []
            folders.forEach(folder => {
                foldersList.push({
                    folderID: folder.get("folderID") as number,
                    folderName: folder.get("folderName") as string,
                    parentFolderID: folder.get("parentFolderID") as number
                })
            })
            this.setState({ folders: foldersList })
        })
        FilesTable.findAll({ where: { parentFolderID: folderID } }).then(files => {
            const filesList: Array<FileInfo> = []
            files.forEach(file => {
                filesList.push({
                    fileID: file.get("fileID") as number,
                    fileName: file.get("fileName") as string,
                    parentFolderID: file.get("parentFolderID") as number
                })
            })
            this.setState({ files: filesList })
        })
    }

    /**
     * Create a new folder with the filename provided on the dialog if foldername don't already exist on the current dir
     */
    createFolder() {
        const folderName = this.folderNameRef.current?.value
        if (folderName && folderName.trim() !== "") {
            if (this.state.folders.filter(folder => folder.folderName === folderName).length === 0) {
                FoldersTable.create({
                    folderName,
                    parentFolderID: this.navigationHistoryStack[this.navigationHistoryStack.length - 1]
                }).then(folder => {
                    if (folder) {
                        const folders = this.state.folders
                        folders.push({
                            folderID: folder.get("folderID") as number,
                            folderName: folderName,
                            parentFolderID: folder.get("parentFolderID") as number
                        })
                        this.setState({ folders, createFolderDialogOpen: false })
                        alert("Folder Created Successfully")
                    }
                })
            } else alert("Folder name already exists")
        }
        else alert("Enter a valid Foldername")
    }

    /**
     * Navigate forward to selected ID
     * @param folderID ID of the folder selected and to be navgated
     */
    navigateForward(folderID: number) {
        this.navigationHistoryStack = [...this.navigationHistoryStack, folderID]
        this.updateCurrentFolder(folderID)
    }

    /**
     * Navigate backward on history
     */
    navigateBackward() {
        if (this.navigationHistoryStack.length > 1) {
            this.navigationHistoryStack = this.navigationHistoryStack.slice(0, -1)
            console.log(this.navigationHistoryStack)
            this.updateCurrentFolder()
        }
    }

    /**
     * Open file upload dialog and send file to server
     */
    uploadFile(context: AppContextType) {
        const selected = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), { title: "Upload File to DFS", properties: ["openFile"] })
        if (selected && selected.length > 0) {
            const filesize = fs.statSync(selected[0]).size / (1024 * 1024)
            let servers = context.servers.filter(server => server.storage ? server.storage?.freeSpace > filesize : true)
            servers = servers.sort((serverA, serverB) => (serverA.storage && serverB.storage) ? serverB.storage.freeSpace - serverA.storage.freeSpace : 0)
            if (servers.length !== 0)
                ipcRenderer.send("UPLOAD_FILE_TO_SERVER", selected[0], servers[0].serverID, this.navigationHistoryStack.slice(-1)[0])
            ipcRenderer.once("FILE_UPLOADED", () => {
                alert("File Uploaded")
                this.updateCurrentFolder()
            })
        }
    }

    /**
     * Check server space and add them to state
     */
    componentDidMount() {
        this.updateCurrentFolder(0)
    }

    render() {
        return (
            <AppContext.Consumer>
                {(context) => {
                    return (
                        <WrapperGrid container>
                            <Topbar onBackPressed={this.navigateBackward} />
                            <Grid container justify="flex-end" alignItems="center">
                                <ActionButton onClick={() => this.setState({ createFolderDialogOpen: true })}>Create Folder</ActionButton>
                                <ActionButton onClick={() => this.uploadFile(context)}>Upload File</ActionButton>
                            </Grid>
                            <Title>Folders</Title>
                            {this.state.folders.map((folder, index) => {
                                return (
                                    <Grid key={index} container item xs={6} md={3} lg={2} xl={1}>
                                        <FolderItem refreshState={() => { this.updateCurrentFolder() }} folderName={folder.folderName} folderID={folder.folderID} onFolderDoubleClicked={this.navigateForward} />
                                    </Grid>
                                )
                            })}
                            <Title>Files</Title>
                            {this.state.files.map((file, index) => {
                                return (
                                    <Grid key={index} container item xs={6} md={3} lg={2} xl={1}>
                                        <FileItem refreshState={() => this.updateCurrentFolder()} fileID={file.fileID} fileName={file.fileName} />
                                    </Grid>
                                )
                            })}
                            <Dialog open={this.state.createFolderDialogOpen} onClose={() => this.setState({ createFolderDialogOpen: false })}>
                                <CreateFolderDialogContainer container justify="center" alignItems="center">
                                    <TextField inputRef={this.folderNameRef} placeholder="Enter folder name" />
                                    <Button color="primary" variant="outlined" onClick={this.createFolder}>Create</Button>
                                </CreateFolderDialogContainer>
                            </Dialog>
                        </WrapperGrid>
                    )
                }}
            </AppContext.Consumer>
        )
    }
}
