import { User } from "../Models/user.entity";

export class UserDTO {
    name!: string
    lastName!: string
    email!: string
    phoneNumber!: string
    birthDate!: Date;

    toEntity(): User {
        const { name, lastName, email, phoneNumber, birthDate } = this;
        const user = new User();
        Object.assign(user, {
            name,
            lastName,
            email,
            phoneNumber,
            birthDate,
        });
        return user;
    }

    static toDTO(user: User): UserDTO {
        const dto = new UserDTO()
        const { name, lastName, email, phoneNumber, birthDate } = user;
        Object.assign(dto, {
            name,
            lastName,
            email,
            phoneNumber,
            birthDate,
        });
        return dto
    }
}