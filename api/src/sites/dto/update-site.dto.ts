import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteDto } from './create-site.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSiteDto extends PartialType(CreateSiteDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
