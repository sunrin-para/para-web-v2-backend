import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApplyService } from '../apply.service';
import { MinioService } from '@/minio/minio.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '@/auth/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@SetMetadata('permission', 'MODERATOR')
@Controller('apply')
export class ApplyPrivateController {
  constructor(
    private readonly applyService: ApplyService,
    private readonly minioService: MinioService,
  ) {}
}
