export class Validators {
    
    static validateEmail(email: string): boolean {
        return RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").test(email)
    }

    static validatePassword(pass: string): boolean {
        return RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}").test(pass)
    }
}