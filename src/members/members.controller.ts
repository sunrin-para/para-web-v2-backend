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
} from '@nestjs/common';
import { MembersService } from './members.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MemberDto } from './dto/member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';
import { FileType } from 'src/multer.config';
import { v4 as uuidv4 } from 'uuid';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly minioService: MinioService,
  ) {}
  private generateFilename(originalname): string {
    const extension = originalname.split('.').pop();
    return `${uuidv4()}.${extension}`;
  }

  @Post()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  @UseInterceptors(FileInterceptor('file'))
  async createMember(
    @Body() createMemberDto: MemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filename = await this.generateFilename(file.originalname);
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
}
