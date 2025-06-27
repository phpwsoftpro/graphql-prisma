import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import type { StringValue } from 'ms';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.accessTokenExpiry as StringValue,
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience,
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.refreshTokenExpiry as StringValue,
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience,
    });
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, authConfig.jwt.secret, {
        issuer: authConfig.jwt.issuer,
        audience: authConfig.jwt.audience,
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
} 