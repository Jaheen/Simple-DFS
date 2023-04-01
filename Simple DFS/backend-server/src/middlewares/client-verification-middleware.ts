import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET_KEY } from "../config";
import { UsersStore } from "../datastores";

/**
 * Verify the client's auth token and provide access to the respective object else reject it
 * @param request HTTP Request passed as reference object.
 * @param response HTTP Response (intermediate response) for return
 * @param next Transfer control to the next middleware
 */
export default function ClientVerificationMiddleware(request: Request, response: Response, next: NextFunction) {
    const ACCESS_TOKEN: string = request.headers.authorization.split(" ")[1]
    const USERNAME = jwt.verify(ACCESS_TOKEN, JWT_SECRET_KEY)
    UsersStore.findOne({ username: USERNAME }, (err: any, user: any) => {
        if (err === null && user !== null) {
            request["username"] = user.username
            next()
        }
        else
            response.json({ status: "failure", message: "token error" })
    })
}