import { User, ROLE } from "../Models/user.entity";

export class UserDTO {
    constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        // public readonly birthDate!: Date;
        public readonly role: ROLE | null) { }

    static fromEntity(user: User): UserDTO {
        return new UserDTO(user.name, user.lastName, user.email, user.phoneNumber, user.role)
    }

    toEntity(): User {
        const user = new User()
        Object.assign(user, this)
        return user
    }

    static createDTO(object: { [key: string]: any; }): UserDTO {
        const { name, lastName, email, phoneNumber, role } = object;
        return new UserDTO(name, lastName, email, phoneNumber, role)
    }
}