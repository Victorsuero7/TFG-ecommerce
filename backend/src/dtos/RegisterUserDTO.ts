export class RegisterUserDTO {
    name!: string
    lastName!: string
    email!: string
    phoneNumber!: string
    password!: string
    // birthDate!: Date;

    private constructor() { }

    static create(body: { [key: string]: any; }): [string | null, RegisterUserDTO?] {

        const { name, lastName, email, password, phoneNumber } = body;
        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!phoneNumber) return ['Missing phone number'];
        // if (!Validators.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password too short'];

        const dto = new RegisterUserDTO()
        dto.name = name;
        dto.lastName = lastName;
        dto.email = email;
        dto.phoneNumber = phoneNumber;
        return [null, dto];
    }

}