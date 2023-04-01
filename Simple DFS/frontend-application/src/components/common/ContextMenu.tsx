import { Grid, MenuItem } from '@material-ui/core'
import React, { Component } from 'react'
import styled from 'styled-components'

const WrapperGrid = styled(Grid)`
    width: inherit !important;
    max-width: 10%;
    max-height: 35vh;
    position: absolute;
    display: ${(props: { visibility: number }) => props.visibility ? "block" : "none !important"};
    background-color: white;
`

/**
 * Prop Types for the component
 */
interface ContextMenuProps {
    anchorEl: React.RefObject<HTMLElement>,
    options: Array<{
        optionName: string,
        onClickHandler: React.MouseEventHandler
    }>
}
interface ContextMenuState {
    isVisible: number
}

/**
 * Context Menu to handle right click of files and folders.
 * listener is added to the passed ref of the anchor element (files and folders)
 */
export default class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
    rootRef: React.RefObject<HTMLDivElement>
    constructor(props: ContextMenuProps | Readonly<ContextMenuProps>) {
        super(props)
        this.state = {
            isVisible: 0
        }
        this.rootRef = React.createRef()
    }
    componentDidMount() {
        if (this.props.anchorEl.current)
            this.props.anchorEl.current.oncontextmenu = (event: MouseEvent) => {
                event.preventDefault()
                console.log(event.x, event.y)
                if (this.rootRef.current) {
                    this.setState({ isVisible: 1 })
                    this.rootRef.current.style.left = `${event.x}px`
                    this.rootRef.current.style.top = `${event.y}px`
                    document.onclick = (ev: MouseEvent) => !(ev.target as Node).contains(this.rootRef.current) ? this.setState({ isVisible: 0 }) : null
                }
            }
    }
    render() {
        return (
            <WrapperGrid ref={this.rootRef} visibility={this.state.isVisible} container direction="column">
                {this.props.options.map((option, index) => {
                    return <MenuItem key={index} onClick={option.onClickHandler}>{option.optionName}</MenuItem>
                })}
            </WrapperGrid>
        )
    }
}
