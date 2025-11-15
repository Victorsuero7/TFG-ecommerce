import express from 'express';
import { MySQLDataSource } from './config/MySQL-datasource';


(async () => {
    try {
        await MySQLDataSource.initialize();
        console.log('Data Source has been initialized!');

        // const products = MySQLDataSource.getRepository(Product);
        // const category = MySQLDataSource.getRepository(Category);
        // let cat = await category.findOne({ where: { id: 1 } });
        // let cat = await category.findOneBy({ id: 1 });
        // console.log(cat);
        // let pr = new Product();
        // pr.category = cat!;
        // pr.name = 'TV 85 pulgadas';
        // products.insert(pr);
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
