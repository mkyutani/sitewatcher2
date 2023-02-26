import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { Site } from './entities/site.entity';

@Module({
  controllers: [SitesController],
  providers: [SitesService],
  imports: [TypeOrmModule.forFeature([Site])]
})
export class SitesModule {}
