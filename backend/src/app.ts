import express from 'express';
import { MySQLDataSource } from './config/MySQL-datasource';


(() => {
    try {
        MySQLDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization', error);
    }
})();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
