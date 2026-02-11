import { Request, Response, NextFunction } from "express"
import { JWTAdapter } from "./Jwt"
import { JWTSchema } from "./JWTSchema"
import { ROLE } from "../Models/user.entity"

export function authorizationMiddleware(acceptedRoles: ROLE[]) {
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).json({ message: "Unauthorized" })

        const payload = await JWTAdapter.validateToken<JWTSchema>(token!)
        if (!payload) return res.status(401).json({ message: "Unauthorized" })
        if (!acceptedRoles.includes(payload.role)) return res.status(403).json({ message: "Forbidden" })

        next()
    }
}