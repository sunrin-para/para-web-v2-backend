import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GallaryService } from './gallary.service';
import { CreateGallaryDto } from './dto/create-gallary.dto';
import { UpdateGallaryDto } from './dto/update-gallary.dto';

@Controller('gallary')
export class GallaryController {
  constructor(private readonly gallaryService: GallaryService) {}

  @Post()
  create(@Body() createGallaryDto: CreateGallaryDto) {
    return this.gallaryService.create(createGallaryDto);
  }

  @Get()
  findAll() {
    return this.gallaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gallaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGallaryDto: UpdateGallaryDto) {
    return this.gallaryService.update(+id, updateGallaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gallaryService.remove(+id);
  }
}
