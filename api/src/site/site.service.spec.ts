import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

describe('SiteService', () => {
  let service: SiteService;

  const mockSites: Site[] = [
    {
      id: 0,
      name: '内閣府',
      url: 'https://www.cao.go.jp/press/houdou.html',
      type: 'html'
    },
    {
      id: 1,
      name: '閣議決定',
      url: 'https://www.kantei.go.jp/jp/kakugikettei/index.html',
      type: 'html'
    }
  ];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteController],
      providers: [
        SiteService,
        {
          provide: getRepositoryToken(Site),
          useClass: Repository
        },
      ],
    }).compile();

    service = module.get<SiteService>(SiteService);
  });

  describe('create()', () => {
    it('should create a site', () => {
      const dto: CreateSiteDto = {
        name: '内閣官房関連会議',
        url: 'https://www.cas.go.jp/jp/seisaku/index.html',
        type: 'html'
      };
      const newSiteId = 2;

      jest.spyOn(service, 'create').mockImplementation(async (dto: CreateSiteDto) => {
        const site: Site = {
          id: newSiteId,
          ...dto,
        };
        return site;
      });

      const result = service.create(dto);
      expect(result).resolves.toEqual({
        id: newSiteId,
        ...dto,
      });
    });
  });

  describe('findAll()', () => {
    it('should return sites', () => {

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return mockSites;
      });

      const result = service.findAll()
      expect(result).resolves.toEqual(mockSites);
    });

    it('should return empty array by no sites found', () => {
      const noSites: Site[] = [];

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return noSites;
      });

      const result = service.findAll();
      expect(result).resolves.toEqual(noSites);
    });
  });

  describe('findOne()', () => {
    it('should return user', () => {
      const site: Site = {
        id: 1,
        name: '内閣府',
        url: 'https://www.cao.go.jp/press/houdou.html',
        type: 'html'
      };

      jest.spyOn(service, 'findOne').mockImplementation(async (id: number) => {
        return site;
      });

      expect(service.findOne(site.id)).resolves.toEqual(site);
    });

    it('should return not found exception', () => {
      const invalidSiteId = -1;
      jest.spyOn(service, 'findOne').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });

      expect(service.findOne(invalidSiteId)).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });

  describe('update()', () => {
    it('should return update result user', () => {
      jest
      .spyOn(service, 'update')
      .mockImplementation(async (id: number, dto: UpdateSiteDto) => {
        return mockSites.find(site => site.id == id);
      });
  
      const dto: UpdateSiteDto = {
        name: '内閣府報道発表'
      };

      expect(service.update(0, {
        name: '内閣府報道発表'
      })).resolves.toEqual(mockSites[0]);
    });
  
    it('should return not found exception', () => {
      jest.spyOn(service, 'update').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });
  
      const dto: UpdateSiteDto = {
        name: '内閣府報道発表',
      };
      const invalidSiteId = -1;
  
      expect(service.update(invalidSiteId, dto)).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });
  
  describe('remove()', () => {
    it('should return remove result', () => {
      jest.spyOn(service, 'remove').mockImplementation(async (id: number) => {
        return mockSites.find(site => site.id == id);
      });
  
      expect(service.remove(0)).resolves.toEqual(mockSites[0]);
    });
  
    it('should return not found exception', () => {
      const invalidSiteId = -1;
      jest.spyOn(service, 'remove').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });
  
      expect(service.remove(invalidSiteId)).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });

});
