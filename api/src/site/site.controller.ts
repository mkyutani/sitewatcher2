import { Controller, Get, Post, Body, Query, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  logger = new Logger(this.constructor.name);

  @Post()
  async create(@Query() createSiteDto: CreateSiteDto): Promise<any> {
    this.logger.log('POST ' + JSON.stringify(createSiteDto));
    return this.siteService.create(createSiteDto);
  }

  @Get()
  async findAll() {
    this.logger.log('GET all');
    return this.siteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log('GET ' + id);
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Query() updateSiteDto: UpdateSiteDto) {
    this.logger.log('PATCH ' + JSON.stringify(updateSiteDto));
    return this.siteService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    this.logger.log('DELETE ' + id);
    return this.siteService.remove(+id);
  }
}
