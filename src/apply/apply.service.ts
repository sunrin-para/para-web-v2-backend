import { Injectable } from '@nestjs/common';
import { ApplyRepository } from './repository/apply.repo';

@Injectable()
export class ApplyService {
  constructor (private readonly applyRepository: ApplyRepository) {}
}
