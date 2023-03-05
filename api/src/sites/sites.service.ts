import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity'

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site) private userRepository: Repository<Site>,
  ) {}

  async create({ name, url, type }: CreateSiteDto): Promise<any> {
    await this.userRepository
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

  findAll() {
    return `This action returns all sites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
