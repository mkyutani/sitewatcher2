import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity'

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site) private siteRepository: Repository<Site>,
  ) {}

  async create({ name, url, type }: CreateSiteDto): Promise<any> {
    await this.siteRepository
    .save({
      name: name,
      url: url,
      type: type
    })
    .catch((e) => {
      throw new InternalServerErrorException(
        `[${e.message}]: Failed to register a site.`,
      );
    });
  }

  async findAll() {
    return await this.siteRepository.find().catch((e) => {
      throw new InternalServerErrorException(
        `[${e.message}]: Failed to get a site.`,
      );
    });
  }

  async findOne(id: number) {
    return await this.siteRepository
    .findOne({
      where: { id: id },
    })
    .then((res) => {
      if (!res) {
        throw new NotFoundException();
      }
      return res;
    })
  }

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    const site = await this.siteRepository.findOne({ where: { id: id } });
    if (!site) {
        throw new NotFoundException();
    }

    site.name = updateSiteDto.name;
    site.url = updateSiteDto.url;
    site.type = updateSiteDto.type;
    return await this.siteRepository.save(site);
  }

  async remove(id: number) {
    const site = await this.siteRepository.findOne({ where: { id: id } });
    if (!site) {
        throw new NotFoundException();
    }
    return await this.siteRepository.delete(site);
  }
}
