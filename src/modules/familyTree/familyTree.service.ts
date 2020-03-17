import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../base.service';

import { BackendLogger } from '../logger/BackendLogger';
import { FamilyTree } from './familyTree.entity';

@Injectable()
export class FamilyTreeService extends BaseService<FamilyTree> {
  private readonly logger = new BackendLogger(FamilyTreeService.name);

  constructor(
    @InjectRepository(FamilyTree)
    private readonly familyTreeRepo: Repository<FamilyTree>,
  ) {
    super(familyTreeRepo);
  }
}