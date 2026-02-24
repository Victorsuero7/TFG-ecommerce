import { randomBytes } from "crypto"

export function generateToken() {
    // return crypto.randomUUID
    return randomBytes(64, (err, buf) => {
        if (err) throw err;
        return buf.toString()
    });
}