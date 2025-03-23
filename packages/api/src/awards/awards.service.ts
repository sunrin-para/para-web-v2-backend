import { Injectable } from '@nestjs/common';
import { AwardsRepository } from './repository/awards.repo';
import { CreateAwardsDto } from './dto/createAwards.dto';

@Injectable()
export class AwardsService {
  constructor(private readonly awardsRepository: AwardsRepository) {}

  async createAwardsHistory(createAwardsDto: CreateAwardsDto) {
    return await this.awardsRepository.createAwardsHistory(createAwardsDto);
  }

  async getAllAwards() {
    return await this.awardsRepository.getAllAwards();
  }

  async getAwardsHistoryByYear(year: number) {
    return await this.awardsRepository.getAwardsHistoryByYear(year);
  }

  async searchAwardsByKeyword(keyword: string) {
    return await this.awardsRepository.searchAwardsByKeyword(keyword);
  }

  async updateAwardsHistory(
    awardUUID: string,
    updateAwardDto: CreateAwardsDto,
  ) {
    return await this.awardsRepository.updateAwardHistory(
      awardUUID,
      updateAwardDto,
    );
  }

  async deleteAwardById(uuid: string) {
    return await this.awardsRepository.deleteAwardById(uuid);
  }

  async deleteManyAwardsByYear(year: number) {
    return await this.awardsRepository.deleteManyAwardsByYear(year);
  }
}
