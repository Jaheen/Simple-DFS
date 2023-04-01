import { Grid } from "@material-ui/core";
import { Folder } from "@material-ui/icons";
import React, { Component } from "react";
import styled from "styled-components";
import Files from "../../../database/models/files";
import Folders from "../../../database/models/folders";
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
const FolderName = styled.p`
    color: #28C0F8;
    width: 100%;
    text-align: center;
`

/**
 * types for props
 */
interface FolderItemProps {
    folderName: string,
    folderID: number,
    onFolderDoubleClicked: (folderID: number) => void
    refreshState: () => void
}

/**
 * Folder component that renders on the explorer
 */
export default class FolderItem extends Component<FolderItemProps> {
    rootRef: React.RefObject<HTMLDivElement>;
    constructor(props: FolderItemProps | Readonly<FolderItemProps>) {
        super(props)
        this.rootRef = React.createRef()
        this.onPaste = this.onPaste.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }
    onPaste() {
        navigator.clipboard.readText().then(clipdata => {
            if (clipdata && clipdata !== "") {
                const clipboardData = JSON.parse(clipdata)
                if (clipboardData.itemType === "file") {
                    if (clipboardData.operationType === "cut") {
                        Files.findOne({ where: { fileID: clipboardData.fileID } }).then(file => {
                            if (file) {
                                file.set("parentFolderID", this.props.folderID)
                                file.save()
                                this.props.refreshState()
                            }
                        }).catch(console.log)
                    } else if (clipboardData.operationType === "copy") {
                        Files.findOne({ where: { fileID: clipboardData.fileID } }).then(file => {
                            if (file) {
                                Files.create({
                                    fileName: file.get("fileName"),
                                    folderParentID: this.props.folderID,
                                    hash: file.get("hash"),
                                    isReplica: true,
                                    replicaOf: file.get("fileID")
                                }).then(console.log).catch(console.log)
                                this.props.refreshState()
                            }
                        }).catch(console.log)
                    }
                }
            } else alert("Nothing is copied")
        })
    }
    onDelete() {
        Files.findAll({ where: { parentFolderID: this.props.folderID } }).then(files => {
            if (files.length === 0) {
                Folders.destroy({ where: { folderID: this.props.folderID } }).then(() => {
                    this.props.refreshState()
                    alert("Folder Deleted")
                })
            } else {
                alert("Folder Not Empty")
            }
        })
    }
    render() {
        return (
            <>
                <WrapperGrid ref={this.rootRef} container onDoubleClick={() => this.props.onFolderDoubleClicked(this.props.folderID)} direction="column" alignItems="center">
                    <Folder fontSize="large" />
                    <FolderName>{this.props.folderName}</FolderName>
                </WrapperGrid>
                <ContextMenu anchorEl={this.rootRef} options={[
                    { optionName: "Paste", onClickHandler: this.onPaste },
                    { optionName: "Delete", onClickHandler: this.onDelete }
                ]} />
            </>
        )
    }
}
