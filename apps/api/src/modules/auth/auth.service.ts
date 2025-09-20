import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: string; // user id
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  private get adminUsername() {
    return process.env.ADMIN_USERNAME || 'admin';
  }
  private get adminPasswordHash() {
    // If ADMIN_PASSWORD is plain text (local dev), hash on the fly (not for prod)
    const pw = process.env.ADMIN_PASSWORD || 'change_me_local_only';
    // Simple cache-less hash for dev usage
    return bcrypt.hashSync(pw, 6);
  }

  async validateAdmin(username: string, password: string) {
    if (username !== this.adminUsername) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, this.adminPasswordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return { id: 'admin', username: this.adminUsername, role: 'ADMIN' };
  }

  async login(username: string, password: string) {
    const user = await this.validateAdmin(username, password);
    const payload: JwtPayload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwt.signAsync(payload);
    return { accessToken: token, user };
  }

  async verify(token: string) {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token, { secret: process.env.JWT_SECRET || 'dev_secret' });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
