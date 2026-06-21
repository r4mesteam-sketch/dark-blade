import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(this.configService.get('BCRYPT_ROUNDS') || '10');
    return bcrypt.hash(password, rounds);
  }

  /**
   * Compare password
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register new user
   */
  async register(dto: RegisterDto) {
    const { email, password, firstName, lastName } = dto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        emailVerificationToken: this.generateToken(),
      },
    });

    // Log activity
    await this.logActivity(user.id, 'USER_REGISTERED', {
      email,
      firstName,
      lastName,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if active
    if (!user.isActive || user.isSuspended) {
      throw new UnauthorizedException('Account is inactive or suspended');
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log activity
    await this.logActivity(user.id, 'LOGIN', { email });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate JWT tokens (access + refresh)
   */
  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRY') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY') || '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: '15m',
    };
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await this.logActivity(userId, 'LOGOUT', {});
    return { message: 'Logged out successfully' };
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't leak if user exists
      return { message: 'If user exists, password reset email sent' };
    }

    const resetToken = this.generateToken();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: resetToken },
    });

    // TODO: Send email with reset token
    return { message: 'Password reset email sent' };
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    const passwordHash = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        emailVerificationToken: null,
      },
    });

    await this.logActivity(user.id, 'PASSWORD_RESET', {});
    return { message: 'Password reset successfully' };
  }

  /**
   * Enable 2FA
   */
  async enable2FA(userId: string) {
    // TODO: Generate TOTP secret
    const secret = this.generateToken();
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return { secret, message: '2FA enabled' };
  }

  /**
   * Verify 2FA code
   */
  async verify2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not enabled');
    }

    // TODO: Verify TOTP code
    return { message: '2FA verified' };
  }

  /**
   * Helper: Generate random token
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  /**
   * Helper: Log user activity
   */
  private async logActivity(userId: string, action: string, details: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          resourceType: 'AUTH',
          changes: JSON.stringify(details),
        },
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Helper: Sanitize user object
   */
  private sanitizeUser(user: User) {
    const { passwordHash, emailVerificationToken, twoFactorSecret, ...rest } = user;
    return rest;
  }
}
