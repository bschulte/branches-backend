import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyTree } from './familyTree.entity'
import { FamilyTreeService } from './familyTree.service';

describe('FamilyTreeService', () => {
  let familyTreeService: FamilyTreeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([FamilyTree])],
      providers: [FamilyTreeService]
    }).compile();

    familyTreeService = module.get<FamilyTreeService>(FamilyTreeService);
  });

});