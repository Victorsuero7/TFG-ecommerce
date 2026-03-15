// test/test-datasource.ts
import { DataSource } from 'typeorm';
import { Category } from '../src/Models/category.entity';
import { Product } from '../src/Models/product.entity';

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/../src/Models/*.entity.ts'], // glob pattern
    synchronize: true,
    logging: false,
});