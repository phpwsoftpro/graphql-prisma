import passport from 'passport';
import { localStrategy } from '../strategies/local.strategy';
import { jwtStrategy } from '../strategies/jwt.strategy';

export const configurePassport = () => {
  // Sử dụng local strategy
  passport.use('local', localStrategy);
  
  // Sử dụng JWT strategy
  passport.use('jwt', jwtStrategy);

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
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
      
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}; 