import { envs } from "../config/envs";
import jwt from 'jsonwebtoken'

type duration = `${number}${'s' | 'm' | 'h' | 'd'}`

// Define it in .env
const SEED = envs.SECRET!

export class JWTAdapter {

    static generateToken(payload: object, duration: duration = '2h'): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, SEED, { expiresIn: duration }, (error, token) => {
                if (error) {
                    console.log(error);
                    return resolve(null);
                }
                return resolve(token!)
            })
        })
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise(resolve => {
            jwt.verify(token, SEED, (error, decoded) => {
                if (error) return resolve(null)
                return resolve(decoded as T)
            })

        })
    }
}


