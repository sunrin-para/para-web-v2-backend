import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  
}
