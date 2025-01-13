import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const canActivate = super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || user == null) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    if (
      !user.email.endsWith('@sunrint.hs.kr') ||
      !user.email.endsWith('@sunrin-para.dev') ||
      !user.role
    ) {
      throw new ForbiddenException(
        '선린인터넷고 외부인 또는 PARA 도메인을 이용하지 않는 사용자는 접근할 수 없습니다.',
      );
    }

    return true;
  }
}
