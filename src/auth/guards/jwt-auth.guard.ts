import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);
    const token = match?.[1];

    if (!token) {
      throw new UnauthorizedException('Please sign in');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);

      if (typeof payload.sub !== 'string' || !payload.sub) {
        throw new UnauthorizedException();
      }

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
