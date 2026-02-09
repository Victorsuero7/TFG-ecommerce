import { ROLE } from "../Models/user.entity"

export type JWTSchema = {
    id:number,
    name:string,
    role:ROLE
}