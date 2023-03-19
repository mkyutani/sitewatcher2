import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';

@Module({
  providers: [SiteService],
  controllers: [SiteController],
  imports: [TypeOrmModule.forFeature([Site])]
})
export class SiteModule {}
