import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/shared/guards/auth.guard';

import { BackendLogger } from '../logger/BackendLogger';
import { FamilyTreeService } from './familyTree.service';

@Controller('family-tree')
@UseGuards(AuthGuard)
export class FamilyTreeController {
  private readonly logger = new BackendLogger(FamilyTreeController.name);

  constructor(private readonly familyTreeService: FamilyTreeService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './gedcomFiles',
      }),
    }),
  )
  public uploadFamilyTreeGedcom(@UploadedFile() file: any) {
    return this.familyTreeService.importNewFamilyTree(file);
  }
}
