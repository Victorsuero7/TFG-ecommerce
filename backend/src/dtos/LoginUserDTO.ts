export class LoginUserDTO {

    private constructor(
        private email: string,
        private password: string) { }

    static create(body: { [key: string]: any; }): [string | null, LoginUserDTO?] {
        const { email, password } = body;
        if (!email) return ['Missing email'];
        if (!password) return ['Missing password'];

        const dto = new LoginUserDTO(email, password)
        return [null, dto];
    }

}