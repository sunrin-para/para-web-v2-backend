import { Module } from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';
import { AwardsRepository } from './repository/awards.repo';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AwardsController],
  providers: [AwardsRepository, AwardsService,],
})
export class AwardsModule {}
