import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FamilyTree {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}