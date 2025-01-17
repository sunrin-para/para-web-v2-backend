import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { GoogleGuard } from 'src/common/guards/google.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from './dto/JwtPayload.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

interface IRequest extends Request {
  user?: any;
  session?: any;
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(GoogleGuard)
  async googleSignIn(@Req() req: IRequest) {
    return req.user;
  }

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

  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: IRequest,
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

  // Super permission을 요구함.
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

  // 본인 비밀번호 변경 요청 또는 super user 요청이면 바로 변경할 수 있도록.
  @Post('/password/change')
  @UseGuards(UserGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    await this.authService.changePassword(user.email, changePasswordDto);
  }

  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  @Post('/password/reset')
  async resetPassword(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    // super user가 user pw 변경하는 컨트롤러.
  }

  @Post('/permission/change')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async changePermission() {}

  @Delete('/account')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'SUPER')
  async deleteAccount() {}

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
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

  @Get('/test1')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async test1() {
    return 'passed';
  }
}
