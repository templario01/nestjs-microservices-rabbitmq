import {
  CanActivate,
  Injectable,
  Inject,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from './services';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);

    return this.authClient
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap((response) => {
          this.addUser(response, context);
        }),
        catchError(() => {
          throw new UnauthorizedException('Invalid Authentication');
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;

    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    }
    if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication;
    }
    if (!authentication) {
      throw new UnauthorizedException('No value provided for Authentication');
    }

    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    }
    if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
