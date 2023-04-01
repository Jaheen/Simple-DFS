import { Grid } from "@material-ui/core";
import { InsertDriveFile } from "@material-ui/icons";
import { ipcRenderer } from "electron";
import { remote } from "electron";
import React from "react";
import { Component } from "react";
import styled from "styled-components";
import ContextMenu from "../../common/ContextMenu";

const WrapperGrid = styled(Grid)`
    background-color: white;
    padding: .5em;
    margin: .5em;
    cursor: pointer;
    &:hover {
        box-shadow: lightgrey 1px 1px 10px 1px;
    }
    svg {
        color: #28C0F8;
    }
`
const Filename = styled.p`
    color: #28C0F8;
    width: 100%;
    text-align: center;
`

interface FileItemProps {
    fileID: number
    fileName: string,
    refreshState: () => void
}

export default class FileItem extends Component<FileItemProps> {
    rootRef: React.RefObject<HTMLDivElement>;
    constructor(props: FileItemProps | Readonly<FileItemProps>) {
        super(props)
        this.rootRef = React.createRef()
        this.onDownload = this.onDownload.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onCut = this.onCut.bind(this)
        this.onCopy = this.onCopy.bind(this)
    }
    onCut() {
        navigator.clipboard.writeText(
            JSON.stringify({ itemType: "file", operationType: "cut", fileID: this.props.fileID })
        ).then(() => console.log("Folder copied to clipboard"))
            .catch(console.log)
    }
    onCopy() {
        navigator.clipboard.writeText(
            JSON.stringify({ itemType: "file", operationType: "copy", fileID: this.props.fileID })
        ).then(() => console.log("Folder copied to clipboard"))
            .catch(console.log)
    }
    onDelete() {
        ipcRenderer.send("DELETE_FILE_FROM_SERVER", this.props.fileID)
        ipcRenderer.once("FILE_DELETED", () => {
            this.props.refreshState()
        })
    }
    onDownload() {
        const dirPath = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), { properties: ["openDirectory"] })
        if (dirPath && dirPath.length > 0) {
            ipcRenderer.send("DOWNLOAD_FILE_FROM_SERVER", dirPath[0], this.props.fileID, this.props.fileName)
            ipcRenderer.once("FILE_DOWNLOADED", () => {
                alert("File Downloaded")
            })
        }
    }
    render() {
        return (
            <>
                <WrapperGrid ref={this.rootRef} container direction="column" alignItems="center">
                    <InsertDriveFile fontSize="large" />
                    <Filename>{this.props.fileName}</Filename>
                </WrapperGrid>
                <ContextMenu anchorEl={this.rootRef} options={[
                    { optionName: "Cut", onClickHandler: this.onCut },
//                    { optionName: "Copy", onClickHandler: this.onCopy },
                    { optionName: "Delete", onClickHandler: this.onDelete },
                    { optionName: "Download", onClickHandler: this.onDownload }
                ]} />
            </>
        )
    }
}
