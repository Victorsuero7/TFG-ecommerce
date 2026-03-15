import express from 'express';
import cors from 'cors';
import { UserRoutes } from './routes/UserRoutes'
import { ProductRoutes } from './routes/ProductRoutes'
import { CategoryRoutes } from './routes/CategoryRoutes'
import { MovementRoutes } from './routes/MovementRoutes'
import path from 'path';
import { envs } from './config/envs';


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// app.use(RBACMiddleware.requireAutentication())
// app.use('/product', RBACMiddleware.requireAutentication(), ProductRoutes.routes)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// const imageHandler = ImageUploaderMiddleware.create("products")
// // then, use it as a middleware specifiying form field name
// app.post('/send-files', imageHandler.single('selfie'), (req, res) => {
//     console.log(req.file)
//     console.log(__dirname);
//     const relativePath = getPath(req.file!.path)
//     console.log("image relative path ", `${relativePath}`);
//     return res.status(200).json({ message: "file recived succesfully" })
// })
app.use("/public", express.static(process.cwd()))

console.log(path.join(process.cwd(), envs.UPLOADS_DIR));

app.use('/user', UserRoutes.routes)
app.use('/product', ProductRoutes.routes)
app.use('/category', CategoryRoutes.routes)
app.use('/movement', MovementRoutes.routes)


//Es para poner el número de páginas en el paginado al listar porfi no me lo borreis 
const { ConfigRoutes } = require('./routes/ConfigRoutes');
app.use('/config', ConfigRoutes.routes);

export { app }