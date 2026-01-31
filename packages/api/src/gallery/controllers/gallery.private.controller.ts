import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common'
import { GalleryService } from '@/gallery/gallery.service'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { CreateAlbumDto } from '@/gallery/dto/create-album.dto'
import { UpdateAlbumDto } from '@/gallery/dto/update-album.dto'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AlbumDto } from '../dto/album.dto'

@ApiBearerAuth()
@UseGuards(AdminGuard)
@SetMetadata('permission', 'MANAGER')
@Controller('gallery')
export class GalleryPrivateController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiOperation({ summary: '앨범 생성' })
  @ApiResponse({ type: AlbumDto })
  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.galleryService.createAlbum(createAlbumDto)
  }

  @ApiOperation({ summary: '앨범 수정' })
  @ApiResponse({ type: AlbumDto })
  @Patch('/edit/:albumUUID')
  async updateAlbum(
    @Param('albumUUID', ParseIntPipe) albumUUID: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.galleryService.updateAlbum(albumUUID, updateAlbumDto)
  }

  @ApiOperation({ summary: '앨범 삭제' })
  @ApiResponse({ type: Boolean })
  @Delete('/:albumUUID')
  async deleteAlbum(@Param('albumUUID', ParseIntPipe) albumUUID: number) {
    return await this.galleryService.deleteAlbum(albumUUID)
  }
}
