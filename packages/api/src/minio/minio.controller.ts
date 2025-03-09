import { Controller } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Minio")
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}
}
