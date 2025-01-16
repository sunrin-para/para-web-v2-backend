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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/common/guards/google.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from './dto/JwtPayload.dto';

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
    const tokens: any = await this.authService.handleGoogleSignIn(user);

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
}
