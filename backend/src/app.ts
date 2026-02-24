import express from 'express';
import cors from 'cors';
import { MySQLDataSource } from './config/MySQL-datasource';
import { UserRoutes } from './routes/UserRoutes'
import { ProductRoutes } from './routes/ProductRoutes'
import { CategoryRoutes } from './routes/CategoryRoutes'
import { MovementRoutes } from './routes/MovementRoutes'
import { getPath, ImageUploaderMiddleware } from './utils/ImageUploaderMiddleware';
import { ConfigRoutes } from './routes/ConfigRoutes';
import path from 'path';
import { envs } from './config/envs';
import { RBACMiddleware } from './utils/AuthorizationMiddleware';


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
// app.use(RBACMiddleware.requireAutentication())


; (async () => {
    try {
        await MySQLDataSource.initialize();
        console.log('Data Source has been initialized!');
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error during Data Source initialization', error);
        process.exit(1);
    }
})();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const imageHandler = ImageUploaderMiddleware.create("products")
// then, use it as a middleware specifiying form field name
app.post('/send-files', imageHandler.single('selfie'), (req, res) => {
    console.log(req.file)
    console.log(__dirname);
    const relativePath = getPath(req.file!.path)
    console.log("image relative path ", `${relativePath}`);
    return res.status(200).json({ message: "file recived succesfully" })
})
app.use("/public", express.static(process.cwd()))

console.log(path.join(process.cwd(), envs.UPLOADS_DIR));

app.use('/user', UserRoutes.routes)
app.use('/product', ProductRoutes.routes)
app.use('/category', CategoryRoutes.routes)
app.use('/movement', MovementRoutes.routes)
