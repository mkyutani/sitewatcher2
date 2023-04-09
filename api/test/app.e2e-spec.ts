import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import config from '../src/config/configuration';
import { Site } from '../src/site/entities/site.entity';
import { SiteController } from '../src/site/site.controller';
import { SiteModule } from '../src/site/site.module';
import { SiteService } from '../src/site/site.service';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Site]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            username: configService.get('database.username'),
            password: configService.get('database.password'),
            database: configService.get('database.name'),
            entities: ['../src/**/entities/**/*.entity.js'],
          }),
          inject: [ConfigService],
        }),
        AppModule,
        SiteModule
      ],
      controllers: [SiteController],
      providers: [SiteService]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await moduleFixture.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/site (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/site')
    console.log(res)
    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTruthy();
  })

});
