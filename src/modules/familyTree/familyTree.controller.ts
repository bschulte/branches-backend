import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';

import { BackendLogger } from '../logger/BackendLogger';
import { FamilyTreeService } from './familyTree.service';

@Controller('familyTree')
@UseGuards(AuthGuard)
export class FamilyTreeController {
  private readonly logger = new BackendLogger(FamilyTreeController.name);

  constructor(private readonly familyTreeService: FamilyTreeService) {}
}