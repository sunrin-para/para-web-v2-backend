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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/common/guards/google.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from './dto/JwtPayload.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

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

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    // controller에서 user refreshToken 추출해야 함. 해당 토큰을 signOut 함수에 넘겨야 함.
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

  @Get('/test2')
  @UseGuards(UserGuard)
  async test2() {
    return '1';
  }
}
