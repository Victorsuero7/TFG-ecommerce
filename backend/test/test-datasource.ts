// test/test-datasource.ts
import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test_tfg',
    synchronize: false,  // ← lo hace clearAllTables manualmente
    dropSchema: false,   // ← ídem
    entities: [__dirname + '/../src/Models/*.entity.ts'],
    logging: false,
});