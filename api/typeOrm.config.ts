import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: process.env.PG_SERVER,
    port: parseInt(process.env.PG_PORT, 10),
    database: process.env.PG_DATABASE,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    entities: ['dist/**/entities/**/*.entity.js'],
    migrations: ['dist/**/migrations/**/*.js'],
    logging: true,
    synchronize: false
});