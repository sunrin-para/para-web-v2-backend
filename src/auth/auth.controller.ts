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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from 'src/common/guards/google.guard';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

interface IRequest extends Request {
  user?: any;
  session?: any;
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
    await this.authService.handleSignIn(user);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: IRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.session) {
      req.session.user = '';
    }
  }
}
