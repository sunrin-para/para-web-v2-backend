import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from '@/gallery/gallery.service';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateAlbumDto } from '@/gallery/dto/create-album.dto';
import { UpdateAlbumDto } from '@/gallery/dto/update-album.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponseProperty,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@SetMetadata('permission', 'MANAGER')
@Controller('gallery')
export class GalleryPrivateController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiOperation({ summary: '앨범 생성' })
  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.galleryService.createAlbum(createAlbumDto);
  }

  @ApiOperation({ summary: '앨범 수정' })
  @Patch('/:albumId')
  async updateAlbum(
    @Param('albumId') albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.galleryService.updateAlbum(albumId, updateAlbumDto);
  }

  @ApiOperation({ summary: '앨범 삭제' })
  @Delete('/:albumId')
  async deleteAlbum(@Param('albumId') albumId: number) {
    return await this.galleryService.deleteAlbum(albumId);
  }
}
