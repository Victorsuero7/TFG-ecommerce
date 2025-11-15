import 'dotenv/config';
import { get } from 'env-var';

// To use these environment variables, import this file into the file where you will need some of them.

// Use required() in production enviroment
export const envs = {
    PORT: get('PORT').asPortNumber(),
    DATABASE_URL: get('DATABASE_URL').asString(),
    DATABASE_USER: get('DATABASE_USER').asString(),
    DATABASE_PASSWD: get('DATABASE_PASSWD').asString(),
    SECRET: get('SECRET').asString(),
};
