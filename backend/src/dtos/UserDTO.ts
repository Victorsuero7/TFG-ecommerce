import { User, ROLE } from "../Models/user.entity";

export class UserDTO {
    constructor(name: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        // birthDate!: Date;
        role: ROLE | null) { }

    static fromEntity(user: User): UserDTO {
        return new UserDTO(user.name, user.lastName, user.email, user.phoneNumber, user.role)
    }

    static createDTO(object: { [key: string]: any; }): UserDTO {
        const { name, lastName, email, phoneNumber, role } = object;
        return new UserDTO(name, lastName, email, phoneNumber, role)
    }
}