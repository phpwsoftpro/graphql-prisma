import { Arg, Mutation, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { AuthResponse } from "../schema/AuthResponse";
import { LoginInput } from "../schema/LoginInput";
import { RegisterInput } from "../schema/RegisterInput";
import { User } from "../schema/User";

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

    // Tạo access token
    const accessToken = randomBytes(32).toString("hex");
    const refreshToken = randomBytes(32).toString("hex");
    
    // Lưu token vào database
    await prisma.token.create({
      data: {
        token: accessToken,
        type: "access",
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        userId: user.id,
      },
    });

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0], // Tạo name từ email
        role: "USER",
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
      avatarUrl: user.avatarUrl || undefined,
      jobTitle: user.jobTitle || undefined,
    };
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Arg("refreshToken") refreshToken: string): Promise<AuthResponse> {
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
      where: { id: existingToken.userId },
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
    const newAccessToken = randomBytes(32).toString("hex");
    const newRefreshToken = randomBytes(32).toString("hex");

    // Cập nhật token cũ thành blacklisted
    await prisma.token.update({
      where: { id: existingToken.id },
      data: { blacklisted: true },
    });

    // Tạo token mới
    await prisma.token.create({
      data: {
        token: newAccessToken,
        type: "access",
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        userId: existingToken.userId,
      },
    });

    await prisma.token.create({
      data: {
        token: newRefreshToken,
        type: "refresh",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userId: existingToken.userId,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        ...user,
        avatarUrl: user.avatarUrl || undefined,
        jobTitle: user.jobTitle || undefined,
      },
    };
  }

  @Mutation(() => Boolean)
  async logout(@Arg("accessToken") accessToken: string): Promise<boolean> {
    // Blacklist access token
    await prisma.token.updateMany({
      where: {
        token: accessToken,
        type: "access",
      },
      data: { blacklisted: true },
    });

    return true;
  }
}
