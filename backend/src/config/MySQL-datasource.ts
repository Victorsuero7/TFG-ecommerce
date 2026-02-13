import { DataSource } from 'typeorm';
import { envs } from './envs';

export const MySQLDataSource = new DataSource({
    type: 'mysql',
    host: envs.DATABASE_HOST!,
    port: envs.DATABASE_PORT!,
    username: envs.DATABASE_USER!,
    password: envs.DATABASE_PASSWORD!,
    database: envs.DATABASE_NAME!,
    entities: ['src/Models/**/*.{js,ts}'],
    synchronize: true,
    logging: true,
    extra: {
        connectionLimit: 5,
    },
});
