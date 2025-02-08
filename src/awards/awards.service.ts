import { Injectable } from '@nestjs/common';
import { AwardsRepository } from './repository/awards.repo';
import { CreateAwardsDto } from './dto/createAwards.dto';

@Injectable()
export class AwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async createAwardsHistory(createAwardsDto: CreateAwardsDto) {
    return await this.awardsRepository.createAwardsHistory(createAwardsDto);
  }

  async getAwardsHistoryByYear(year: number) {
    return await this.awardsRepository.getAwardsHistoryByYear(year);
  }
}
