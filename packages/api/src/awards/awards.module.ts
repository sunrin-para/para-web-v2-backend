import { Module } from '@nestjs/common'
import { AwardsService } from './awards.service'
import { AwardsRepository } from './repository/awards.repo'
import { AwardsPublicController } from './controllers/awards.public.controller'
import { AwardsPrivateController } from './controllers/awards.private.controller'

@Module({
  controllers: [AwardsPublicController, AwardsPrivateController],
  providers: [AwardsRepository, AwardsService],
})
export class AwardsModule {}
