import { Grid, IconButton } from '@material-ui/core'
import { ArrowBack, Search } from '@material-ui/icons'
import React from 'react'
import styled from 'styled-components'

const WrapperGrid = styled(Grid)`
    background-color: white;
    padding: .5em;
`
const SearchBar = styled(Grid)`
    background-color: #f4f4f4;
    justify-self: flex-end;
    padding: .5em;
    border-radius: 1000px;
`
const SearchBox = styled.input`
    flex: 1;
    border: none;
    background-color: transparent;
    outline: none;
`

interface TopbarProps {
    onBackPressed: () => void
}
export default function Topbar(props: TopbarProps) {
    return (
        <WrapperGrid container justify="flex-start">
            <IconButton onClick={props.onBackPressed}>
                <ArrowBack />
            </IconButton>
            {/* <SearchBar item container md={6} xl={3} lg={4} alignItems="center">
                <Search />
                <SearchBox type="text" placeholder="Search current directory ..." />
            </SearchBar> */}
        </WrapperGrid>
    )
}
