import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@/user/user.service';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean | null> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user
      ? await this.userService.findUserByEmail(request.user.email)
      : null;
    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    if (
      !user.email.endsWith('@sunrint.hs.kr') ||
      !user.email.endsWith('@sunrin-para.dev') ||
      !user.permission
    ) {
      throw new ForbiddenException(
        '선린인터넷고 외부인 또는 PARA 도메인을 이용하지 않는 사용자는 접근할 수 없습니다.',
      );
    }

    return true;
  }
}
