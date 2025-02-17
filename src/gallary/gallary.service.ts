import { BadRequestException, Injectable } from '@nestjs/common';
import { GallaryRepository } from './repository/gallary.repo';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class GallaryService {
  constructor(private readonly gallaryRepository: GallaryRepository) {}

  async createAlbum(createAlbumDto: CreateAlbumDto, fileUrls: Array<string>) {
    if (fileUrls.length < 1) {
      throw new BadRequestException(
        '등록할 앨범에 사진이 포함되지 않았습니다.',
      );
    }
    return await this.gallaryRepository.createAlbum(createAlbumDto, fileUrls);
  }

  async deleteAlbum(albumId: number) {
    if (albumId < 0) {
      throw new BadRequestException('albumId 값은 0보다 커야 합니다.');
    }
    return await this.gallaryRepository.deleteAlbum(albumId);
  }
}
