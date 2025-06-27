import { Arg, Mutation, Resolver, Ctx } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthResponse } from "../schema/AuthResponse";
import { LoginInput } from "../schema/LoginInput";
import { RegisterInput } from "../schema/RegisterInput";
import { User } from "../schema/User";
import { JWTService, TokenPayload } from "../common/services/jwt.service";
import { authConfig } from "../common/config/auth.config";
import { UserRole } from "../enums/UserRole";

const prisma = new PrismaClient();

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async login(@Arg("loginInput") loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    
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
      throw new Error("User not found");
    }

    // So sánh password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Xóa password trước khi trả về user
    const { password: _, ...userWithoutPassword } = user;

    // Tạo JWT payload
    const payload: TokenPayload = {
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    // Tạo access token và refresh token
    const accessToken = JWTService.generateAccessToken(payload);
    const refreshToken = JWTService.generateRefreshToken(payload);

    // Lưu refresh token vào database
    await prisma.token.create({
      data: {
        token: refreshToken,
        type: "refresh",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userId: user.id,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        role: user.role as UserRole,
        avatarUrl: user.avatarUrl || undefined,
        jobTitle: user.jobTitle || undefined,
      },
    };
  }

  @Mutation(() => User)
  async register(@Arg("registerInput") registerInput: RegisterInput): Promise<User> {
    const { email, password } = registerInput;
    
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0], // Tạo name từ email
        role: UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Chuyển đổi null thành undefined để phù hợp với GraphQL schema
    return {
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl || undefined,
      jobTitle: user.jobTitle || undefined,
    };
  }

  @Mutation(() => User)
  async createAdmin(@Arg("registerInput") registerInput: RegisterInput): Promise<User> {
    const { email, password } = registerInput;
    
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, authConfig.bcrypt.saltRounds);

    // Tạo user mới với role ADMIN
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0], // Tạo name từ email
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Chuyển đổi null thành undefined để phù hợp với GraphQL schema
    return {
      ...user,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl || undefined,
      jobTitle: user.jobTitle || undefined,
    };
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Arg("refreshToken") refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = JWTService.verifyToken(refreshToken);
      
      // Tìm refresh token trong database
      const existingToken = await prisma.token.findFirst({
        where: {
          token: refreshToken,
          type: "refresh",
          blacklisted: false,
        },
      });

      if (!existingToken || existingToken.expires < new Date()) {
        throw new Error("Invalid or expired refresh token");
      }

      // Lấy thông tin user
      const user = await prisma.user.findUnique({
        where: { id: parseInt(payload.userId) },
        select: {
          id: true,
          name: true,
          email: true,
          jobTitle: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Tạo token mới
      const newPayload: TokenPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = JWTService.generateAccessToken(newPayload);
      const newRefreshToken = JWTService.generateRefreshToken(newPayload);

      // Cập nhật token cũ thành blacklisted
      await prisma.token.update({
        where: { id: existingToken.id },
        data: { blacklisted: true },
      });

      // Tạo token mới
      await prisma.token.create({
        data: {
          token: newRefreshToken,
          type: "refresh",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userId: user.id,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          ...user,
          role: user.role as UserRole,
          avatarUrl: user.avatarUrl || undefined,
          jobTitle: user.jobTitle || undefined,
        },
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  @Mutation(() => Boolean)
  async logout(@Arg("accessToken") accessToken: string): Promise<boolean> {
    try {
      // Verify token để lấy userId
      const payload = JWTService.verifyToken(accessToken);
      
      // Blacklist tất cả refresh tokens của user
      await prisma.token.updateMany({
        where: {
          userId: parseInt(payload.userId),
          type: "refresh",
        },
        data: {
          blacklisted: true,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => User, { nullable: true })
  async me(@Ctx() context?: any): Promise<User | null> {
    const user = context.user;
    if (!user) {
      return null;
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: parseInt(user.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        avatarUrl: true,
        phone: true,
        timezone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!userRecord) {
      return null;
    }

    return {
      ...userRecord,
      role: userRecord.role as UserRole,
      avatarUrl: userRecord.avatarUrl || undefined,
      jobTitle: userRecord.jobTitle || undefined,
      phone: userRecord.phone || undefined,
      timezone: userRecord.timezone || undefined,
    };
  }
}
