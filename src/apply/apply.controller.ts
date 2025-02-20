import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplyService } from './apply.service';
import { MinioService } from 'src/minio/minio.service';

@Controller('apply')
export class ApplyController {
  constructor(
    private readonly applyService: ApplyService,
    private readonly minioService: MinioService,
  ) {}
}
