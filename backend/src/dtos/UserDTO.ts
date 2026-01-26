import { User, ROLE } from "../Models/user.entity";

export class UserDTO {
    name!: string
    lastName!: string
    email!: string
    phoneNumber!: string
    // birthDate!: Date;
    role!: ROLE | null

    private constructor() { }

    static fromEntity(user: User): UserDTO {
        const dto = new UserDTO();
        dto.name = user.name;
        dto.lastName = user.lastName;
        dto.email = user.email;
        dto.phoneNumber = user.phoneNumber;
        dto.role = user.role;
        return dto;
    }
}