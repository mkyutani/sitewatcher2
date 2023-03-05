import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sites')
export class Site {

  @PrimaryGeneratedColumn({
    comment: 'site ID',
  })
  readonly id: number;

  @Column('varchar', { comment: 'site name' })
  name: string;

  @Column('varchar', { comment: 'site url' })
  url: string;

  @Column('varchar', { comment: 'site type' })
  type: string;

  constructor(name: string) {
    this.name = name;
  }
}