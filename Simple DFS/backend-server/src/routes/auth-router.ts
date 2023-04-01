import { Request, Response, Router } from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import { UsersStore } from "../datastores";

/**
 * Router to handle authentication on route /auth/
 */
const authRouter = Router();

/**
 * POST request for login with username and password
 */
authRouter.post("/login", (req: Request, res: Response) => {
    const USERNAME: string = req.body.username
    const PASSWORD: string = req.body.password
    if (USERNAME && PASSWORD)
        if (USERNAME.trim() !== "" && PASSWORD.trim() !== "") {
            UsersStore.findOne({ username: USERNAME }, (err, user) => {
                if (!err)
                    if (user !== null)
                        if (user.password === crypto.createHash("sha512").update(PASSWORD).digest("base64"))
                            res.json({
                                result: "success",
                                token: jwt.sign(USERNAME, JWT_SECRET_KEY)
                            })
                        else
                            res.json({
                                result: "failure",
                                message: "password mismatch"
                            })
                    else
                        res.json({
                            result: "failure",
                            message: "user not found"
                        })
                else
                    res.json({
                        result: "failure",
                        message: "unable to process",
                        err
                    })
            })
        }
})

export default authRouter
