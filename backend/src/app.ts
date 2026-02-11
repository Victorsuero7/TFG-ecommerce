import express from 'express';
import cors from 'cors';
import { MySQLDataSource } from './config/MySQL-datasource';
import { UserRoutes } from './routes/UserRoutes'
import { ProductRoutes } from './routes/ProductRoutes'
import { CategoryRoutes } from './routes/CategoryRoutes'


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));


(async () => {
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

app.use('/user', UserRoutes.routes)
app.use('/product', ProductRoutes.routes)
app.use('/category', CategoryRoutes.routes)
