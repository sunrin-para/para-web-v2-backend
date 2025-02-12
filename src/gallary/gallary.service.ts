import { Injectable } from '@nestjs/common';
import { CreateGallaryDto } from './dto/create-gallary.dto';
import { UpdateGallaryDto } from './dto/update-gallary.dto';

@Injectable()
export class GallaryService {
  create(createGallaryDto: CreateGallaryDto) {
    return 'This action adds a new gallary';
  }

  findAll() {
    return `This action returns all gallary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gallary`;
  }

  update(id: number, updateGallaryDto: UpdateGallaryDto) {
    return `This action updates a #${id} gallary`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallary`;
  }
}
