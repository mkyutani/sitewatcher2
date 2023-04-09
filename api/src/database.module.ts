import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Site } from './site/entities/site.entity';

export const databaseEntities = [Site];
export const migrationsFiles = ['dist/**/migrations/**/*.js']

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.PG_SERVER,
        port: parseInt(process.env.PG_PORT, 10),
        database: process.env.PG_DATABASE,
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        entities: databaseEntities,
        migrations: migrationFiles,
        logging: true,
        synchronize: false
      })
    })
  ]
})

export class DatabaseModule {}