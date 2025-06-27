import { Strategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authConfig } from '../config/auth.config';

const prisma = new PrismaClient();

export const localStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      // Tìm user theo email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          jobTitle: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          password: true,
        }
      });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // So sánh password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Xóa password trước khi trả về user
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
); 