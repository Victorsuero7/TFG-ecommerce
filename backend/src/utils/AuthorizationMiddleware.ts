import { Request, Response, NextFunction } from "express"
import { JWTAdapter } from "./Jwt"
import { JWTSchema } from "./JWTSchema"

export function authorizationMiddleware(acceptedRoles: string[]) {
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1]
        const payload = await JWTAdapter.validateToken<JWTSchema>(token!)

        if (!payload) return res.status(401).json({ message: "Unauthorized" })
        if (!acceptedRoles.includes(payload.role)) return res.status(403).json({ message: "Forbidden" })

        next()
    }
}