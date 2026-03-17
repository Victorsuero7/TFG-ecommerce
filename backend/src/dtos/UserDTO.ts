import { User, ROLE } from "../Models/user.entity";

export class UserDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly birthDate: Date | null | undefined,
        public readonly role: ROLE | null | undefined) { }

    static fromEntity(user: User): UserDTO {
        return new UserDTO(
            user?.id,
            user?.name,
            user?.lastName,
            user?.email,
            user?.phoneNumber,
            user?.birthDate ?? null,
            user?.role,
        )
    }

    toEntity(): User {
        const user = new User()
        Object.assign(user, this)
        return user
    }

    static createDTO(object: { [key: string]: any; }): UserDTO {
        const { id, name, lastName, email, phoneNumber, birthDate, role } = object;
        const hasBirthDate = Object.prototype.hasOwnProperty.call(object, 'birthDate');
        let normalizedBirthDate: Date | null | undefined = undefined;

        if (hasBirthDate) {
            if (!birthDate) {
                normalizedBirthDate = null;
            } else {
                const parsedBirthDate = new Date(birthDate);
                normalizedBirthDate = Number.isNaN(parsedBirthDate.getTime()) ? null : parsedBirthDate;
            }
        }

        return new UserDTO(id, name, lastName, email, phoneNumber, normalizedBirthDate, role)
    }
}