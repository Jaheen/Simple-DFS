import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import { Route, Switch } from "react-router";
import styled from "styled-components";
import { AppContext } from "../contexts";
import Dashboard from "../components/MainPage/Dashboard/Dashboard";
import Files from "../components/MainPage/Files/Files";
import ManageServers from "../components/MainPage/ManageServers/ManageServers";
import Settings from "../components/MainPage/Settings/Settings";
import Sidebar from "../components/MainPage/Sidebar";
import Servers from "../database/models/servers";
import { ServerData, ServerInfo } from "../types";
import axios from "axios";

const WrapperGrid = styled(Grid)`
    background-color: #f4f4f4;
`
interface MainPageState {
    servers: Array<ServerInfo>
}
/**
 * Mainpage that contains the Filemanager.
 */
export default class MainPage extends Component<{}, MainPageState> {
    constructor(props: any) {
        super(props)
        this.state = {
            servers: []
        }
        this.addServer = this.addServer.bind(this)
        this.updateServer = this.updateServer.bind(this)
    }

    /**
     * Add new server to database and also to state
     * @param server data object containing new server
     */
    addServer(server: ServerData) {
        Servers.create({
            serverName: server.serverName,
            serverAddress: server.serverAddress,
            portNumber: server.portNumber,
            accessToken: server.accessToken
        }).then(newServer => {
            const servers: ServerInfo[] = this.state.servers
            axios.get(`http://${newServer.get("serverAddress")}:${newServer.get("portNumber")}/getInfo/serverStorage`).then(response => {
                if (response.status === 200) {
                    servers.push({
                        serverID: newServer.get("serverID") as number,
                        serverName: newServer.get("serverName") as string,
                        serverAddress: newServer.get("serverAddress") as string,
                        portNumber: newServer.get("portNumber") as number,
                        storage: {
                            usedSpace: response.data.usedSpace,
                            freeSpace: response.data.freeSpace
                        }
                    })
                    this.setState({ servers })
                    alert("Server Added Successfully")
                }
            })
        }).catch(alert)
    }

    /**
     * Update details of existing server
     * @param server data object containing new data
     * @param serverID ID of the server needs to be updated
     */
    updateServer(server: ServerData, serverID: number) {
        Servers.findOne({ where: { serverID } }).then(targetServer => {
            if (targetServer) {
                targetServer.set("serverName", server.serverName)
                targetServer.set("serverAddress", server.serverAddress)
                targetServer.set("portNumber", server.portNumber)
                targetServer.set("accessToken", server.accessToken)
                targetServer.save().then(updatedServer => {
                    const servers = this.state.servers.filter(server => server.serverID !== serverID)
                    axios.get(`http://${updatedServer.get("serverAddress")}:${updatedServer.get("portNumber")}/getInfo/serverStorage`).then(response => {
                        if (response.status === 200) {
                            servers.push({
                                serverID: updatedServer.get("serverID") as number,
                                serverName: updatedServer.get("serverName") as string,
                                serverAddress: updatedServer.get("serverAddress") as string,
                                portNumber: updatedServer.get("portNumber") as number,
                                storage: {
                                    usedSpace: response.data.usedSpace,
                                    freeSpace: response.data.freeSpace
                                }
                            })
                            this.setState({ servers })
                            alert("Server Updated Successfully")
                        }
                    })
                })
            } else alert("No such server found please verify Server ID")
        })
    }

    componentDidMount() {
        Servers.findAll().then(serversList => {
            const servers: ServerInfo[] = []
            serversList.forEach(server => {
                servers.push({
                    serverID: server.get("serverID") as number,
                    serverName: server.get("serverName") as string,
                    serverAddress: server.get("serverAddress") as string,
                    portNumber: server.get("portNumber") as number
                })
            })
            this.setState({ servers })
            servers.forEach((server, index) => {
                axios.get(`http://${server.serverAddress}:${server.portNumber}/getInfo/serverStorage`).then(response => {
                    if (response.status === 200) {
                        server.storage = {
                            usedSpace: response.data.usedSpace,
                            freeSpace: response.data.freeSpace
                        }
                        servers[index] = server
                    }
                })
            })
            this.setState({ servers })
            console.log(servers)
        })
    }

    /**
     * Render the component
     */
    render() {
        return (
            <AppContext.Provider value={{
                servers: this.state.servers,
                addNewServer: this.addServer,
                updateExistingServer: this.updateServer
            }}>
                <WrapperGrid container>
                    <Grid item xs={3}>
                        <Sidebar />
                    </Grid>
                    <Grid item xs={9}>
                        <Switch>
                            <Route path="/main" exact>
                                <Dashboard />
                            </Route>
                            <Route path="/main/files">
                                <Files />
                            </Route>
                            <Route path="/main/manage-servers">
                                <ManageServers />
                            </Route>
                            <Route path="/main/settings">
                                <Settings />
                            </Route>
                        </Switch>
                    </Grid>
                </WrapperGrid>
            </AppContext.Provider>
        )
    }
}
