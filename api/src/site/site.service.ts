import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity'

@Injectable()
export class SiteService {
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

  async update(id: number, dto: UpdateSiteDto) {
    const target = await this.siteRepository.findOne({ where: { id: id } });
    if (!target) {
      throw new NotFoundException('Not Found');
    } else {
      await this.siteRepository.update(id, dto);
      return target;
    }
  }

  async remove(id: number) {
    const target = await this.siteRepository.findOne({ where: { id: id } });
    if (!target) {
      throw new NotFoundException('Not Found');
    } else {
      await this.siteRepository.delete(id);
      return target;
    }
  }
}
