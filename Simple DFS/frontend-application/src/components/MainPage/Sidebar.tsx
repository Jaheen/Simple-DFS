import { Grid } from "@material-ui/core"
import React, { Component } from "react"
import { Link, RouteComponentProps, withRouter } from "react-router-dom"
import styled from "styled-components"

const WrapperGrid = styled(Grid)`
    background-color: #007EAE;
    height: 100vh;
    padding: .5em;
    overflow: auto;
`
const SidebarTitle = styled.h1`
    color: white;
    text-align: center;
    margin: 1em 0;
`
const SidebarItem = styled(Link)`
    display: block;
    color: white;
    background-color: ${(props: { active: boolean | number }) => props.active ? "#2E9DC7" : "transparent"};
    padding: .75em;
    text-decoration: none;
    font-size: 18px;
    margin: 10px 0 0 0;
    &:hover {
        background-color: #2E9DC7;
    }
`

class Sidebar extends Component<RouteComponentProps> {
    render() {
        return (
            <WrapperGrid container direction="column">
                <SidebarTitle>Simple DFS</SidebarTitle>
                <SidebarItem active={this.props.location.pathname === "/main" ? 1 : 0} to="/main">Dashboard</SidebarItem>
                <SidebarItem active={this.props.location.pathname === "/main/files" ? 1 : 0} to="/main/files">Files</SidebarItem>
                <SidebarItem active={this.props.location.pathname === "/main/manage-servers" ? 1 : 0} to="/main/manage-servers">Manage Servers</SidebarItem>
                <SidebarItem active={this.props.location.pathname === "/main/settings" ? 1 : 0} to="/main/settings">Settings</SidebarItem>
            </WrapperGrid>
        )
    }
}

export default withRouter(Sidebar)
