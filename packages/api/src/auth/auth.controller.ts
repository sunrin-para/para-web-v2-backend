import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from '@/auth/guards/google.guard';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserGuard } from '@/auth/guards/user.guard';
import { AdminGuard } from '@/auth/guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

interface IRequest extends Request {
  user?: any;
  session?: any;
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 로그인' })
  @Get('/google')
  @UseGuards(GoogleGuard)
  async googleSignIn() {}

  @ApiOperation({ summary: '구글 로그인 리다이렉트' })
  @ApiResponse({ status: 200, description: '토큰 발급 성공', type: Object })
  @Get('/google/redirect')
  @UseGuards(GoogleGuard)
  async googleRedirection(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
    res.header('Access-Control-Allow-Credentials', 'true');

    return await this.authService.handleGoogleSignIn(
      req.user._json.email,
      req.user._json.name,
    );
  }

  @ApiOperation({ summary: '일반 로그인' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: '로그인 성공', type: Object })
  @ApiResponse({ status: 400, description: '이메일 또는 비밀번호가 누락됨' })
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Access-Control-Allow-Origin', process.env.DOMAIN);
    res.header('Access-Control-Allow-Credentials', 'true');

    return await this.authService.handleSignIn(signInDto);
  }

  @ApiOperation({ summary: 'PARA INTERNAL 계정 생성' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '계정 생성 성공' })
  @ApiResponse({ status: 400, description: '필수 데이터 누락' })
  @ApiBearerAuth()
  @Post('/register')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: '액세스 토큰 갱신' })
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
    return await this.authService.signOut(req.user.email);
  }
}
