import { DataSource } from 'typeorm';

export default async function globalSetup() {
    const ds = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'test_tfg',
        synchronize: true,   // crea las tablas
        dropSchema: true,    // borra y recrea — solo aquí, una vez
        entities: [__dirname + '/../src/Models/*.entity.ts'],
        logging: false,
    });

    await ds.initialize();
    console.log('💾 Schema creado');
    await ds.destroy(); // cerramos, los tests se conectarán por su cuenta
}