import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/auth/guards/google.guard';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtPayload } from './dto/JwtPayload.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { ChangePasswordDto } from './dto/changeInformations.dto';

interface IRequest extends Request {
  user?: any;
  session?: any;
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '구글 로그인',
  })
  @ApiResponse({ status: 200, description: '구글 로그인 성공' })
  @Get('/google')
  @UseGuards(GoogleGuard)
  async googleSignIn(@Req() req: IRequest) {
    return req.user;
  }

  @ApiOperation({
    summary: '구글 로그인 리다이렉트',
    description: '구글 OAuth 로그인 후 리다이렉트되는 엔드포인트입니다.',
  })
  @ApiResponse({ status: 200, description: '토큰 발급 성공', type: Object })
  @Get('/google/redirect')
  @UseGuards(GoogleGuard)
  async googleRedirection(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    const tokens: any = await this.authService.handleGoogleSignIn({
      email: user._json.email,
      name: user._json.name,
    });

    res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
    res.header('Access-Control-Allow-Credentials', 'true');

    return tokens;
  }

  @ApiOperation({
    summary: '일반 로그인',
    description: '이메일과 비밀번호를 통한 로그인을 시도합니다.',
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: '로그인 성공', type: Object })
  @ApiResponse({ status: 400, description: '이메일 또는 비밀번호가 누락됨' })
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email or Password is null.');
    }
    const tokens = await this.authService.handleSignIn(signInDto);

    res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
    res.header('Access-Control-Allow-Credentials', 'true');

    return tokens;
  }

  @ApiOperation({
    summary: '관리자 계정 생성',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '계정 생성 성공' })
  @ApiResponse({ status: 400, description: '필수 데이터 누락' })
  @ApiBearerAuth()
  @Post('/register')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async register(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.password || !createUserDto.permission) {
      throw new BadRequestException('There is null data in createUserDto');
    }
    const user = await this.authService.registerUser(createUserDto);
    return user;
  }

  @ApiOperation({
    summary: '비밀번호 변경',
    description: '본인의 비밀번호를 변경합니다.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공' })
  @ApiBearerAuth()
  @Post('/password/change')
  @UseGuards(UserGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IRequest,
  ) {
    const user = req.user;
    return await this.authService.changePassword(user.email, changePasswordDto);
  }

  @ApiOperation({
    summary: '비밀번호 초기화',
    description: 'Super 관리자가 다른 사용자의 비밀번호를 초기화합니다.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: '비밀번호 초기화 성공' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  @Post('/password/reset')
  async resetPassword(@Body() changePasswordDto: ChangePasswordDto) {
    const result = await this.authService.changePassword(
      changePasswordDto.email,
      changePasswordDto,
    );
    return result;
  }

  @ApiOperation({
    summary: '권한 변경',
    description: 'Super 관리자가 사용자의 권한을 변경합니다.',
  })
  @ApiResponse({ status: 200, description: '권한 변경 성공' })
  @ApiBearerAuth()
  @Post('/permission/change')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async changePermission(@Body() changePermissionDto) {
    const result = await this.authService.changePermission(changePermissionDto);
    return result;
  }

  @ApiOperation({
    summary: '액세스 토큰 갱신',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { refreshToken: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공' })
  @ApiBearerAuth()
  @Post('/refresh')
  @UseGuards(UserGuard)
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }

  @ApiOperation({
    summary: '기본 관리자 계정 생성',
    description: '시스템 초기 설정을 위한 기본 관리자 계정을 생성합니다.',
  })
  @ApiResponse({ status: 201, description: '기본 관리자 계정 생성 성공' })
  @Post('/generate/default/account')
  async generateDefaultAccount() {
    return await this.authService.generateDefaultAdminAccount();
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
    return await this.authService.deleteAccount(email);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '현재 로그인된 사용자를 로그아웃 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiBearerAuth()
  @Get('/logout')
  @UseGuards(UserGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: IRequest) {
    const user: JwtPayload = req.user;
    try {
      await this.authService.signOut(user.email);
      if (req.session) {
        req.session.user = '';
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
