import { DataSource } from 'typeorm';
import enitity from './enitity';

export const dataSourceFunction = () => {
    return new DataSource({
        type: 'postgres',
        host: process.env['DATABASE_HOST'],
        port: Number(process.env['DATABASE_PORT']),
        username: process.env['DATABASE_USERNAME'] || 'postgres',
        password: process.env['DATABASE_PASSWORD'] || 'root',
        database: process.env['DATABASE_NAME'],
        entities: enitity,
        schema: process.env['DATABASE_SCHEMA'] || 'public',
        // synchronize: true,
        logging: false,
    });
};
