export class Validators {

    static validateEmail(email: string): boolean {
        return RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").test(email)
    }

    static validatePassword(pass: string): boolean {
        return RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}").test(pass)
    }

    static validateString(value: string, options: string[],): boolean {
        for (let i of options) {
            if (i.toLowerCase() === value.toLocaleLowerCase()) return true
        }
        return false
    }

    static validateStringCaseSensitive(value: string, options: string[],): boolean {
        for (let i of options) {
            if (i === value) return true
        }
        return false
    }
}