import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Site {

  @PrimaryGeneratedColumn({
    comment: 'auto generated ID',
  })
  readonly id: number;

  @Column('varchar', { comment: 'name' })
  name: string;

  @Column('varchar', { comment: 'url' })
  url: string;

  @Column('varchar', { comment: 'type' })
  type: string;

  constructor(name: string, url: string, type: string) {
    this.name = name;
    this.url = url;
    this.type = type;
  }

}