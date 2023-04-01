import { Button, Grid } from "@material-ui/core";
import { Lock, Person } from "@material-ui/icons";
import { createHash } from "crypto"
import React, { Component } from "react";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";
import styled from "styled-components";
import Settings from "../database/models/settings";

const WrapperGrid = styled(Grid)`
    background-color: #f4f4f4;
    min-height: 100vh;
`;
const FormWrapper = styled(Grid)`
    background-color: white;
    padding: 3em;
    & > *{
        margin: 1em 0 !important;    
    }
`;
const FormTitle = styled.h1`
    color: #28C0F9;
    text-align: center;
    font-weight: bold;
`
const FormFieldContainer = styled(Grid)`
    background-color: #f4f4f4;
    border-radius: 1000px;
    padding: .5em;
`
const FormField = styled.input`
    border: none;
    outline: none;
    padding: .5em;
    background-color: transparent;
    color: grey;
    flex: 1;
`
const FormFieldButton = styled(Button)`
    background-color: #28C0F9 !important;
    border-radius: 1000px !important;
    color: white !important;
    font-size: 20px !important;
    padding: .25em !important;
    width: 50%;
    text-transform: unset !important;
`

/**
 * Authentication page to handle app login
 */
class AuthPage extends Component<RouteComponentProps> {
    usernameFieldRef: React.RefObject<HTMLInputElement>;
    passwordFieldRef: React.RefObject<HTMLInputElement>;

    /**
     * Constructor to initialize component methods and vars
     */
    constructor(props: RouteComponentProps<{}, StaticContext, unknown> | Readonly<RouteComponentProps<{}, StaticContext, unknown>>) {
        super(props)
        this.onLoginClicked = this.onLoginClicked.bind(this)
        this.usernameFieldRef = React.createRef()
        this.passwordFieldRef = React.createRef()
    }

    /**
     * Listener for login button click event
     */
    onLoginClicked() {
        if (this.usernameFieldRef.current?.value.trim() !== "" && this.passwordFieldRef.current?.value.trim() !== "")
            Settings.findOne({ where: { name: "Username" } }).then(setting => {
                if (setting)
                    if (setting.get("value") === this.usernameFieldRef.current?.value)
                        Settings.findOne({ where: { name: "Password" } }).then(setting => {
                            if (setting)
                                if (setting.get("value") === createHash("sha512").update(this.passwordFieldRef.current?.value as string).digest("base64"))
                                    this.props.history.push("/main")
                                else
                                    alert("Password Mismatch")
                        })
                    else
                        alert("Username not found")
            })
        else
            alert("Please Enter Username and Password")
    }
    
    render() {
        return (
            <WrapperGrid container justify="center" alignItems="center">
                <FormWrapper item xs={10} md={6} lg={4} container direction="column" alignItems="center">
                    <FormTitle>Simple DFS</FormTitle>
                    <FormFieldContainer item container alignItems="center">
                        <Person />
                        <FormField ref={this.usernameFieldRef} type="text" required placeholder="Enter username here ..." />
                    </FormFieldContainer>
                    <FormFieldContainer item container alignItems="center">
                        <Lock />
                        <FormField ref={this.passwordFieldRef} type="password" required placeholder="Enter password here ..." />
                    </FormFieldContainer>
                    <FormFieldButton onClick={this.onLoginClicked}>Login</FormFieldButton>
                </FormWrapper>
            </WrapperGrid>
        )
    }
}

export default withRouter(AuthPage)
