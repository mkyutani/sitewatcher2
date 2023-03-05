import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSiteDto {
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
