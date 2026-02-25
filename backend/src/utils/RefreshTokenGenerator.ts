import { randomBytes } from "crypto"


export async function generateToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        randomBytes(64, (err, buf) => {
            if (err) reject(err);
            return resolve(buf.toString("hex"))
        });
    })
}