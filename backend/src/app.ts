import express from 'express';
import { MySQLDataSource } from './config/MySQL-datasource';
import { UserRoutes } from './routes/UserRoutes'


const app = express();
const port = 3000;
app.use(express.json());


(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    try {
        MySQLDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization', error);
    }
})();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', UserRoutes.routes)
