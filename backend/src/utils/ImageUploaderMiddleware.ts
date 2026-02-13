import { existsSync, mkdirSync } from "fs"
import multer from "multer"
import path from "path"
import { envs } from "../config/envs";

const DEFAULT_ROUTE = path.join(process.cwd(), envs.UPLOADS_DIR)


// USE EXAMPLE
// Create an image handler
// const imageHandler = ImageUploaderMiddleware.create()
// then, use it as a middleware specifiying form field name
// app.post('/send-files', imageHandler.array('selfie'), (req, res) => {})

// MAKE SURE FRONTEND FORM IS AS enctype='multipart/form-data'

export class ImageUploaderMiddleware {
    static create(route: string = ""): multer.Multer {
        const finalRoute = path.join(DEFAULT_ROUTE, route)
        console.log("directorio creado: ", finalRoute);
        if (!existsSync(finalRoute)) {
            // console.log(existsSync(finalRoute));
            mkdirSync(finalRoute, { recursive: true })
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, finalRoute)
            },
            filename: function (req, file, cb) {
                cb(null, `${Date.now()}-${file.originalname.replaceAll(" ", "-")}`)
            }
        })
        const folder = multer({ storage: storage })
        return folder
    }
}

export function getPath(filePath: string): string | undefined {
    if (!filePath) return
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    return relativePath
}