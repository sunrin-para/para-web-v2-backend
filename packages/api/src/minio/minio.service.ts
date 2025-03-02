import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { FileType } from '@/common/enums/FileType.enum';
import { v4 as uuidv4 } from 'uuid';

const env = process.env;

@Injectable()
export class MinioService {
  async uploadFile(file: File, fileName: string, type: FileType) {
    const minioClient = new Minio.Client({
      endPoint: env.MINIO_URL,
      useSSL: true,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const path = type ? `${type}/${fileName}` : fileName;
    await minioClient.putObject(env.BUCKET_NAME, path, buffer, file.size);
    return `https://${env.MINIO_URL}/${env.BUCKET_NAME}/${path}`;
  }

  generateFilename(originalname): string {
    const extension = originalname.split('.').pop();
    return `${uuidv4()}.${extension}`;
  }
}
