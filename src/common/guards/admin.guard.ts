import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '../enums/Permission.enum';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean | null> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission || !Permission[requiredPermission])
      throw new InternalServerErrorException(
        'Please set Guard permission via setMetaData decorator.',
      );

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user ||
      !user.permission ||
      !(Permission[user.permission] <= Permission[requiredPermission])
    ) {
      throw new ForbiddenException('해당 페이지에 접근할 권한이 없습니다.');
    }

    return true;
  }
}
