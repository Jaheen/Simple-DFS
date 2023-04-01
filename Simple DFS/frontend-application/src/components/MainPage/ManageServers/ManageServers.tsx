import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import styled from "styled-components";
import { AppContext as AppContextType } from "../../../types"
import { AppContext } from "../../../contexts"

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
    background-color: #5456f0 !important;
    color: white !important;
    margin: 1em !important;
`
const ServerDialogFormContainer = styled(Grid)`
    margin: 1em 0;
    & > * {
        width: 100%;
    }
`
const ServersListTable = styled(Table)`
    background-color: white;
`

interface ManageServersState {
    serverDialog: {
        open: boolean,
        type: string
    }
}

/**
 * ManageServers Component
 */
export default class ManageServers extends Component<{}, ManageServersState> {
    serverNameRef: React.RefObject<HTMLInputElement>
    serverAddressRef: React.RefObject<HTMLInputElement>
    portNumberRef: React.RefObject<HTMLInputElement>
    usernameRef: React.RefObject<HTMLInputElement>
    passwordRef: React.RefObject<HTMLInputElement>
    serverIDRef: React.RefObject<HTMLInputElement>
    constructor(props: any) {
        super(props);
        this.state = {
            serverDialog: {
                open: false,
                type: "create"
            }
        }
        this.proceedDialog = this.proceedDialog.bind(this)
        this.serverNameRef = React.createRef()
        this.serverAddressRef = React.createRef()
        this.portNumberRef = React.createRef()
        this.usernameRef = React.createRef()
        this.passwordRef = React.createRef()
        this.serverIDRef = React.createRef()
    }

    /**
     * Handler Addition of new Server as well as Updating existing server
     * @param context context provided by the consumer
     */
    proceedDialog(context: AppContextType) {
        if (this.serverNameRef.current?.value.trim() !== "" && this.serverAddressRef.current?.value.trim() !== "" && this.portNumberRef.current?.value.trim() !== "" && this.usernameRef.current?.value.trim() !== "" && this.passwordRef.current?.value.trim() !== "") {
            axios.post(`http://${this.serverAddressRef.current?.value}:${this.portNumberRef.current?.value}/auth/login`, {
                username: this.usernameRef.current?.value,
                password: this.passwordRef.current?.value
            }).then(response => {
                console.log(response)
                if (response.status === 200 && response.data.result === "success") {
                    if (this.state.serverDialog.type === "create") {
                        context.addNewServer({
                            serverName: this.serverNameRef.current?.value as string,
                            serverAddress: this.serverAddressRef.current?.value as string,
                            portNumber: parseInt(this.portNumberRef.current?.value as string),
                            accessToken: response.data.token
                        })
                        this.setState({ serverDialog: { ...this.state.serverDialog, open: false } })
                    } else if (this.state.serverDialog.type === "update") {
                        if (this.serverIDRef.current !== null)
                            context.updateExistingServer({
                                serverName: this.serverNameRef.current?.value as string,
                                serverAddress: this.serverAddressRef.current?.value as string,
                                portNumber: parseInt(this.portNumberRef.current?.value as string),
                                accessToken: response.data.token
                            }, parseInt(this.serverIDRef.current?.value))
                        this.setState({ serverDialog: { ...this.state.serverDialog, open: false } })
                    }
                } else if (response.data.result === "failure")
                    alert(response.data.message)
            })
        }
        else
            alert("Please enter all fields")
    }

    /**
     * Render the component
     */
    render() {
        return (
            <AppContext.Consumer>
                {(context) => {
                    return (
                        <WrapperGrid container>
                            <Title>Manage Servers</Title>
                            {/* Action buttons */}
                            <Grid container justify="flex-end" alignItems="center">
                                <ActionButton onClick={() => this.setState({ serverDialog: { open: true, type: "create" } })}>Add Server</ActionButton>
                                <ActionButton onClick={() => this.setState({ serverDialog: { open: true, type: "update" } })}>Update Server</ActionButton>
                            </Grid>
                            {/* List all Servers in a table */}
                            <ServersListTable>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Server ID</TableCell>
                                        <TableCell>Server Name</TableCell>
                                        <TableCell>Server Address</TableCell>
                                        <TableCell>Port Number</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {context.servers.map((server, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{server.serverID}</TableCell>
                                                <TableCell>{server.serverName}</TableCell>
                                                <TableCell>{server.serverAddress}</TableCell>
                                                <TableCell>{server.portNumber}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </ServersListTable>
                            {/* Dialog to handle new server and update server */}
                            <Dialog open={this.state.serverDialog.open}
                                onClose={() => this.setState({ serverDialog: { open: false, type: this.state.serverDialog.type } })}>
                                <DialogTitle>{this.state.serverDialog.type === "create" ? "Add a New DFS Server" : "Update server configuration"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Enter details of the server</DialogContentText>
                                    <ServerDialogFormContainer container>
                                        {this.state.serverDialog.type === "update" ? <TextField inputRef={this.serverIDRef} label="Server ID" /> : null}
                                        <TextField inputRef={this.serverNameRef} label="Server Name" />
                                        <TextField inputRef={this.serverAddressRef} label="Server Address" />
                                        <TextField inputRef={this.portNumberRef} label="PORT Number" />
                                    </ServerDialogFormContainer>
                                    <DialogContentText>Enter credentials for the server</DialogContentText>
                                    <ServerDialogFormContainer container>
                                        <TextField inputRef={this.usernameRef} label="Server Username" />
                                        <TextField inputRef={this.passwordRef} label="Server Password" type="password" />
                                    </ServerDialogFormContainer>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={_ => this.proceedDialog(context)}>Proceed</Button>
                                </DialogActions>
                            </Dialog>
                        </WrapperGrid>
                    )
                }}
            </AppContext.Consumer>
        )
    }
}
