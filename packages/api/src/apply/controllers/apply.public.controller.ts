import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApplyService } from '../apply.service';
import { MinioService } from '@/minio/minio.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from '@/auth/guards/user.guard';

@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller('apply')
export class ApplyPublicController {
  constructor(
    private readonly applyService: ApplyService,
    private readonly minioService: MinioService,
  ) {}
}
