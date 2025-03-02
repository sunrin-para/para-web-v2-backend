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

  async updateAwardsHistory(awardId: number, updateAwardDto: CreateAwardsDto) {
    return await this.awardsRepository.updateAwardHistory(
      awardId,
      updateAwardDto,
    );
  }

  async deleteAwardById(id: number) {
    return await this.awardsRepository.deleteAwardById(id);
  }

  async deleteManyAwardsByYear(year: number) {
    return await this.awardsRepository.deleteManyAwardsByYear(year);
  }
}
