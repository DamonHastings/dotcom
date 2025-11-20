import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const secretHeader = req.headers['x-admin-secret'] || req.headers['x-admin-token'] || req.headers['authorization'];

    const adminSecret = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN;
    if (!adminSecret) {
      // If no admin secret configured, disallow by default
      throw new UnauthorizedException('Admin secret not configured');
    }

    let incoming: string | undefined;
    if (Array.isArray(secretHeader)) incoming = secretHeader[0];
    else incoming = secretHeader as string | undefined;

    if (!incoming) throw new UnauthorizedException('Missing admin secret');

    // Support bare token or Bearer token
    if (incoming.startsWith('Bearer ')) incoming = incoming.replace(/^Bearer\s+/i, '').trim();

    if (incoming !== adminSecret) throw new UnauthorizedException('Invalid admin secret');

    return true;
  }
}
