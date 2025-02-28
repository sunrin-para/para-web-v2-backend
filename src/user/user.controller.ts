import {
  Controller,
  Delete,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  ChangePermissionDto,
} from './dto/changeInformations.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

interface IRequest extends Request {
  user?: any;
  session?: any;
}

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
  @ApiResponse({
    status: 400,
    description: '권한 오류 또는 존재하지 않는 계정입니다.',
  })
  @ApiBearerAuth()
  @Post('/password/change')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MODERATOR')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IRequest,
  ) {
    return await this.userService.changePassword(
      req.user.email,
      changePasswordDto.email,
      changePasswordDto.newPassword,
    );
  }

  @ApiOperation({ summary: '권한 변경' })
  @ApiResponse({ status: 200, description: '권한 변경 성공' })
  @ApiBearerAuth()
  @Post('/permission/change')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async changePermission(@Body() changePermissionDto: ChangePermissionDto) {
    const result = await this.userService.changePermission(
      changePermissionDto.email,
      changePermissionDto.newPermission,
    );
    return result;
  }

  @ApiOperation({
    summary: '계정 삭제',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: '계정 삭제 성공' })
  @ApiBearerAuth()
  @Delete('/account')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async deleteAccount(@Body('email') email: string) {
    return await this.userService.deleteAccount(email);
  }
}
