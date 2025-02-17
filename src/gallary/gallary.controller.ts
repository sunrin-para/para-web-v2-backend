import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GallaryService } from './gallary.service';

@Controller('gallary')
export class GallaryController {
  constructor(private readonly gallaryService: GallaryService) {}

}
