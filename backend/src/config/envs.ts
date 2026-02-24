import 'dotenv/config';
import { get } from 'env-var';

// To use these environment variables, import this file into the file where you will need some of them.

// Use required() in production enviroment
export const envs = {
    PORT: get('PORT').asPortNumber(),
    DATABASE_URL: get('DATABASE_URL').asString(),
    DATABASE_USER: get('DATABASE_USER').asString(),
    DATABASE_NAME: get('DATABASE_NAME').asString(),
    DATABASE_PORT: get('DATABASE_PORT').asInt(),
    DATABASE_HOST: get('DATABASE_HOST').asString(),
    DATABASE_PASSWORD: get('DATABASE_PASSWORD').asString(),
    SECRET: get('JWT_SECRET').asString(),
    PRODUCTS_PER_PAGE: get('PRODUCTS_PER_PAGE').asInt(),
    UPLOADS_DIR: get('UPLOADS_DIR').required().asString()
};
