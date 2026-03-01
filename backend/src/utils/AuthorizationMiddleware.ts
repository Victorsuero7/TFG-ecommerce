import { Request, Response, NextFunction, RequestHandler } from "express"
import { JWTAdapter } from "./Jwt"
import { JWTSchema } from "./JWTSchema"
import { ROLE } from "../Models/user.entity"

export class RBACMiddleware {
    static requireAutentication() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.headers.authorization?.split(' ')[1]
                console.log("headers in middleware ", req.headers);
                console.log("token in middleware ", token);
                if (!token) return res.status(401).json({ message: "Unauthorized" })
                const payload = await JWTAdapter.validateToken<JWTSchema>(token!)
                if (!payload) return res.status(401).json({ message: "Unauthorized" })
                req.user = payload
                next()

            }
            catch (error) {
                res.status(500).json({ mesage: "something went wrong" })
            }
        }
    }

    static requireRole(acceptedRoles: ROLE[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!acceptedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" })
                next()
            } catch (error) {
                return res.status(500).json({ mesage: "something went wrong" })
            }
        }
    }
}