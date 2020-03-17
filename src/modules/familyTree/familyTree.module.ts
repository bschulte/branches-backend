import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyTree } from './familyTree.entity';
import { FamilyTreeService } from './familyTree.service';
import { FamilyTreeController } from './familyTree.controller';
import { FamilyTreeResolver } from './familyTree.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyTree])],
  controllers: [FamilyTreeController],
  providers: [FamilyTreeService, FamilyTreeResolver],
  exports: [FamilyTreeService]
})
export class FamilyTreeModule {}