import { Controller, Get, Post, Body, Query, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  logger = new Logger(this.constructor.name);

  @Post()
  async create(@Query() createSiteDto: CreateSiteDto): Promise<any> {
    this.logger.log('POST ' + JSON.stringify(createSiteDto));
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  async findAll() {
    this.logger.log('GET all');
    return this.sitesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log('GET ' + id);
    return this.sitesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Query() updateSiteDto: UpdateSiteDto) {
    this.logger.log('PATCH ' + JSON.stringify(updateSiteDto));
    return this.sitesService.update(+id, updateSiteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log('DELETE ' + id);
    return this.sitesService.remove(+id);
  }
}
