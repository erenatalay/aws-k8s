import { Observable } from 'rxjs';
import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly i18nService: I18nService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err, 
    user, 
  ): TUser {

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          message: this.i18nService.translate('error.auth.unauthorized'),
        })
      );
    }

    const dbUser = this.prismaService.users.findUnique({
      where: {
        id: user.id,
        deletedAt: null,
        isActive: true,
      },
    });
    
    if (!dbUser) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.auth.userInactive'),
      });
    }

    return dbUser as TUser;
  }
}
