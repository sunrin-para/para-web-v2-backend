import { BadRequestException, Injectable } from '@nestjs/common';
import { GallaryRepository } from './repository/gallary.repo';

@Injectable()
export class GallaryService {
  constructor(private readonly gallaryRepository: GallaryRepository) {}

  async deleteAlbum(albumId: number) {
    if (albumId < 0) {
      throw new BadRequestException('albumId 값은 0보다 커야 합니다.');
    }
    return await this.gallaryRepository.deleteAlbum(albumId);
  }
}
