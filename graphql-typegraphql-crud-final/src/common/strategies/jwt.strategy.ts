import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { authConfig } from '../config/auth.config';

const prisma = new PrismaClient();

export const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authConfig.jwt.secret,
    issuer: authConfig.jwt.issuer,
    audience: authConfig.jwt.audience,
  },
  async (payload, done) => {
    try {
      // Kiểm tra token có bị blacklist không
      const blacklistedToken = await prisma.token.findFirst({
        where: {
          token: payload.jti, // JWT ID
          blacklisted: true,
        },
      });

      if (blacklistedToken) {
        return done(null, false);
      }

      // Lấy thông tin user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          jobTitle: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
); 