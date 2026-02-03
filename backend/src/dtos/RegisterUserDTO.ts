export class RegisterUserDTO {

    // birthDate!: Date;

    private constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly password: string) { }

    static create(body: { [key: string]: any; }): [string | null, RegisterUserDTO?] {

        const { name, lastName, email, password, phoneNumber } = body;
        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!phoneNumber) return ['Missing phone number'];
        // if (!Validators.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password too short'];

        const dto = new RegisterUserDTO(name, lastName, email, phoneNumber, password)
        return [null, dto];
    }
}