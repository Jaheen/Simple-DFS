import { Grid } from "@material-ui/core"
import React, { useContext } from "react"
import styled from "styled-components"
import { AppContext } from "../../../contexts"
import ServerTile from "./ServerTile"

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

export default function Dashboard() {
    const { servers } = useContext(AppContext)
    return (
        <WrapperGrid container alignItems="flex-start">
            <Title>Dashboard</Title>
            {servers.map((server, index) => {
                return (
                    <Grid key={index} container item xs={12} md={6} lg={4}>
                        <ServerTile server={server} />
                    </Grid>
                )
            })}
        </WrapperGrid>
    )
}
