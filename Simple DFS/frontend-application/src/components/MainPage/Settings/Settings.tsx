import { Button, Grid, TextField } from "@material-ui/core";
import * as crypto from "crypto";
import React, { Component, createRef } from "react";
import styled from "styled-components";
import ApplicationSettings from "../../../database/models/settings";

const WrapperGrid = styled(Grid)`
    padding: 10px;
    max-height: 100vh;
    overflow: auto;
`
const FormContainer = styled(Grid)`
    background-color: white;
    border-radius: 5px;
    padding: 1em;
`

export default class Settings extends Component {
    usernameRef: React.RefObject<HTMLInputElement>
    passwordRef: React.RefObject<HTMLInputElement>
    confirmPasswordRef: React.RefObject<HTMLInputElement>
    constructor(props: any) {
        super(props)
        this.usernameRef = createRef()
        this.passwordRef = createRef()
        this.confirmPasswordRef = createRef()
        this.saveSettings = this.saveSettings.bind(this)
    }
    saveSettings() {
        const username = this.usernameRef.current?.value
        const password = this.passwordRef.current?.value
        const confirmPassword = this.confirmPasswordRef.current?.value
        if (username?.trim() !== "" && password?.trim() !== "" && confirmPassword?.trim() !== "")
            if (password === confirmPassword) {
                ApplicationSettings.findOne({ where: { name: "Username" } }).then(setting => {
                    if (setting) {
                        setting.set("value", username)
                        setting.save()
                    }
                })
                ApplicationSettings.findOne({ where: { name: "Password" } }).then(setting => {
                    if (setting) {
                        setting.set("value", crypto.createHash("sha512").update(password as string).digest("base64"))
                        setting.save()
                    }
                })
                alert("Settings Updated")
            } else alert("Passwords don't match")
        else alert("Please Fill all the fields")
    }
    render() {
        return (
            <WrapperGrid container>
                <FormContainer container justify="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField inputRef={this.usernameRef} variant="outlined" label="Change Username" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField inputRef={this.passwordRef} variant="outlined" label="New Password" type="password" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField inputRef={this.confirmPasswordRef} variant="outlined" label="Confirm Password" type="password" />
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={this.saveSettings} color="primary">Save Settings</Button>
                    </Grid>
                </FormContainer>
            </WrapperGrid>
        )
    }
}
