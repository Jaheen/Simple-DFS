import { Grid } from "@material-ui/core"
import { Dns } from "@material-ui/icons"
import axios from "axios"
import React, { useState } from "react"
import styled from "styled-components"
import { ServerInfo } from "../../../types"

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
        margin: 0 5px 0 0;
    }
`
const ServerName = styled.p`
    font-size: 18px;
    font-weight: bold;
    color: grey;
`
const ServerFreeSpace = styled.p`
    align-self: flex-end;
    color: grey;
`
const UsageIndicatorBar = styled.div`
    height: 5px;
    outline: #28C0F8 solid 1px;
    margin: 5px 0 0 0;
`
const UsageIndicatorTrack = styled.div`
    height: inherit;
    width: ${(props: { width: Number }) => `${props.width}%`};
    background-color: #28C0F8;
`

interface ServerTileProps {
    server: ServerInfo
}

export default function ServerTile(props: ServerTileProps) {
    const [state, setState] = useState({ serverUsage: NaN })
    axios.get(`http://${props.server.serverAddress}:${props.server.portNumber}/getInfo/serverStorage`).then(response => {
        if (response.status === 200) {
            setState({ serverUsage: (response.data.usedSpace / (response.data.usedSpace + response.data.freeSpace)) * 100 })
        }
    })
    return (
        <WrapperGrid container alignItems="center" title={`${100 - state.serverUsage}% free`}>
            <Dns fontSize="large" />
            <Grid item xs container direction="column">
                <ServerName>{props.server.serverName}</ServerName>
                <ServerFreeSpace>{Math.round(100 - state.serverUsage)}% free</ServerFreeSpace>
                <UsageIndicatorBar>
                    <UsageIndicatorTrack width={state.serverUsage} />
                </UsageIndicatorBar>
            </Grid>
        </WrapperGrid>
    )
}
