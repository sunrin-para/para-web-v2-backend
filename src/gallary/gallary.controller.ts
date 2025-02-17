import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GallaryService } from './gallary.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('gallary')
export class GallaryController {
  constructor(private readonly gallaryService: GallaryService) {}
}
