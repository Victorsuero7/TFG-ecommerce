// import { Validators } from "../utils/Validators";

export class RegisterUserDTO {

    private constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly password: string,
        public readonly birthDate?: Date | null) { }

    static create(body: { [key: string]: any; }): [string | null, RegisterUserDTO?] {

        const { name, lastName, email, password, phoneNumber, birthDate } = body;
        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!phoneNumber) return ['Missing phone number'];
        // if (!Validators.validateEmail(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        // if (!Validators.validatePassword(password)) return ['Password is not valid'];
        if (password.length < 6) return ['Password too short'];

        let normalizedBirthDate: Date | null | undefined = undefined;
        if (Object.prototype.hasOwnProperty.call(body, 'birthDate')) {
            if (!birthDate) {
                normalizedBirthDate = null;
            } else {
                const parsedBirthDate = new Date(birthDate);
                normalizedBirthDate = Number.isNaN(parsedBirthDate.getTime()) ? null : parsedBirthDate;
            }
        }

        const dto = new RegisterUserDTO(name, lastName, email, phoneNumber, password, normalizedBirthDate)
        return [null, dto];
    }
}