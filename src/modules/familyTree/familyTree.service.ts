import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs from 'fs';

import { BaseService } from '../../base.service';
import { BackendLogger } from '../logger/BackendLogger';
import { FamilyTree } from './familyTree.entity';
import parseGedcom from 'parse-gedcom';

@Injectable()
export class FamilyTreeService extends BaseService<FamilyTree> {
  private readonly logger = new BackendLogger(FamilyTreeService.name);

  constructor(
    @InjectRepository(FamilyTree)
    private readonly familyTreeRepo: Repository<FamilyTree>,
  ) {
    super(familyTreeRepo);
  }

  public importNewFamilyTree(gedcomFile: any) {
    console.log('file:', gedcomFile);
    const data = fs.readFileSync(gedcomFile.path, 'utf-8');

    const gedcom = parseGedcom.parse(data);
    console.log(gedcom);

    return { success: true };
  }
}
