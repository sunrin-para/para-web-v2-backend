import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  Put,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MemberDto } from './dto/member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';
import { FileType } from 'src/multer.config';

import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FileInterceptor('file'))
  async createMember(
    @Body() createMemberDto: MemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename = this.minioService.generateFilename(file.originalname);
    const fileUrl = await this.minioService.uploadFile(
      new File([file.buffer], file.originalname),
      filename,
      FileType.MEMBERS,
    );
    const result = await this.membersService.createMember(
      createMemberDto,
      fileUrl,
    );

    return {
      message: '멤버가 성공적으로 등록되었습니다!',
      result: result,
    };
  }

  @Get()
  async getAllMembers() {
    return await this.membersService.getAllMembers();
  }

  @Get('/:generation')
  async getMembersByGeneration(@Param('generation') generation: number) {
    return await this.membersService.getMembersByGeneration(generation);
  }

  @Get('/:memberId')
  async getMemberDetail(@Param('memberId') memberId: number) {
    return await this.membersService.getMemberDetail(memberId);
  }

  @Patch('/:memberId')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FileInterceptor('file'))
  async updateMemberDetail(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() updateMemberDto?: UpdateMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let fileUrl = undefined;
    if (file) {
      const filename = await this.minioService.generateFilename(file.originalname);
      fileUrl = await this.minioService.uploadFile(
        new File([file.buffer], file.originalname),
        filename,
        FileType.MEMBERS,
      );
    }

    const result = await this.membersService.updateMemberDetail(
      memberId,
      updateMemberDto,
      fileUrl,
    );

    return {
      message: '멤버 정보가 성공적으로 수정되었습니다!',
      result: result,
    };
  }

  @Delete('/:memberId')
  async deleteMember(@Param('memberId') memberId: number) {
    return await this.membersService.deleteMember(memberId);
  }
}
