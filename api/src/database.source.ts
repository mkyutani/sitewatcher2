import { Module } from '@nestjs/common';
import { databaseEntities, migrationsFiles  } from 'src/database.module';
import { DataSource } from 'typeorm';
import configuration from './config/configuration';

@Module ({
  imports: ({
    
  })
})

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configuration.
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: databaseEntities,
  migrations: migrationsFiles,
  logging: true,
  synchronize: false
});