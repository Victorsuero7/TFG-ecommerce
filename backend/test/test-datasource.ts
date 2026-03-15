// test/test-datasource.ts
import { DataSource } from 'typeorm';

// Base de datos de test
export const TestDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',        // tu MySQL local o docker
    port: 3306,
    username: 'root',    // usuario de test
    password: '',    // contraseña de test
    database: 'test_tfg',      // base de datos de test
    synchronize: true,        // crea tablas automáticamente
    dropSchema: true,         // limpia todo al inicializar
    entities: [__dirname + '/../src/Models/*.entity.ts'], // glob pattern
    logging: false,
});