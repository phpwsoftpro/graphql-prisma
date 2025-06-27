import { Arg, ID, Mutation, Query, Resolver, UseMiddleware, Ctx } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { User } from "../schema/User";
import { CreateUserInput, UpdateUserInput, DeleteUserInput } from "../schema/UserInput";
import { LoginPayload } from "../schema/LoginPayload";
import { UserListResponse } from "../schema/UserListResponse";
import { UserFilter } from "../schema/UserFilter";
import { UserSort } from "../schema/UserSort";
import { OffsetPaging } from "../schema/PagingInput";
import { verifyToken, typeGraphqlAuth } from "../common/middleware/auth.middleware";
import { PermissionService } from "../common/services/permission.service";
import { UserRole } from "../enums/UserRole";

const prisma = new PrismaClient();

@Resolver(() => User)
export class UserResolver {
  @Query(() => UserListResponse)
  @UseMiddleware(typeGraphqlAuth)
  async users(
    @Arg("filter", () => UserFilter, { nullable: true }) filter: UserFilter,
    @Arg("sorting", () => [UserSort], { nullable: true }) sorting: UserSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging,
    @Ctx() context?: any
  ) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    if (!PermissionService.canRead(userRole)) {
      throw new Error("Access denied: Insufficient permissions to read data");
    }
    const where: any = {};
    if (filter?.name) {
      if (typeof filter.name === 'string') {
        if ((filter.name as string).trim() !== '' && filter.name !== '%%') {
          where.name = { contains: filter.name as string };
        }
      } else if (typeof filter.name.iLike === 'string' && filter.name.iLike !== '%%' && filter.name.iLike.trim() !== '') {
        where.name = { contains: filter.name.iLike, mode: 'insensitive' };
      } else if (typeof filter.name.contains === 'string' && filter.name.contains.trim() !== '' && filter.name.contains !== '%%') {
        where.name = { contains: filter.name.contains };
      } else if (typeof filter.name.eq === 'string' && filter.name.eq.trim() !== '' && filter.name.eq !== '%%') {
        where.name = filter.name.eq;
      } else if (typeof filter.name.equals === 'string' && filter.name.equals.trim() !== '' && filter.name.equals !== '%%') {
        where.name = filter.name.equals;
      }
    }
    if (filter?.email) {
      if (typeof filter.email === 'string') {
        if ((filter.email as string).trim() !== '' && filter.email !== '%%') {
          where.email = { contains: filter.email as string };
        }
      } else if (typeof filter.email.iLike === 'string' && filter.email.iLike !== '%%' && filter.email.iLike.trim() !== '') {
        where.email = { contains: filter.email.iLike, mode: 'insensitive' };
      } else if (typeof filter.email.contains === 'string' && filter.email.contains.trim() !== '' && filter.email.contains !== '%%') {
        where.email = { contains: filter.email.contains };
      } else if (typeof filter.email.eq === 'string' && filter.email.eq.trim() !== '' && filter.email.eq !== '%%') {
        where.email = filter.email.eq;
      } else if (typeof filter.email.equals === 'string' && filter.email.equals.trim() !== '' && filter.email.equals !== '%%') {
        where.email = filter.email.equals;
      }
    }
    if (filter?.role) {
      if (typeof filter.role === 'string') {
        if ((filter.role as string).trim() !== '' && filter.role !== '%%') {
          where.role = { contains: filter.role as string };
        }
      } else if (typeof filter.role.iLike === 'string' && filter.role.iLike !== '%%' && filter.role.iLike.trim() !== '') {
        where.role = { contains: filter.role.iLike, mode: 'insensitive' };
      } else if (typeof filter.role.contains === 'string' && filter.role.contains.trim() !== '' && filter.role.contains !== '%%') {
        where.role = { contains: filter.role.contains };
      } else if (typeof filter.role.eq === 'string' && filter.role.eq.trim() !== '' && filter.role.eq !== '%%') {
        where.role = filter.role.eq;
      } else if (typeof filter.role.equals === 'string' && filter.role.equals.trim() !== '' && filter.role.equals !== '%%') {
        where.role = filter.role.equals;
      }
    }
    if (filter?.companies?.id?.eq) {
      where.companies = {
        some: { id: Number(filter.companies.id.eq) }
      };
    }
    if (filter?.companies?.id?.in && Array.isArray(filter.companies.id.in)) {
      where.companies = {
        some: { id: { in: filter.companies.id.in.map((id: string) => Number(id)) } }
      };
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ id: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return { nodes, totalCount };
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(typeGraphqlAuth)
  async user(@Arg("id", () => ID) id: string, @Ctx() context?: any) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    if (!PermissionService.canRead(userRole)) {
      throw new Error("Access denied: Insufficient permissions to read data");
    }
    return prisma.user.findUnique({ where: { id: Number(id) } });
  }

  @Mutation(() => User)
  @UseMiddleware(typeGraphqlAuth)
  async createUser(
    @Arg("input", () => CreateUserInput) input: CreateUserInput,
    @Ctx() context?: any
  ) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    if (!PermissionService.canCreate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to create data");
    }
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: input.user.email }
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return prisma.user.create({
      data: input.user,
    });
  }

  @Mutation(() => User)
  @UseMiddleware(typeGraphqlAuth)
  async updateUser(
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput,
    @Ctx() context?: any
  ) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    if (!PermissionService.canUpdate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to update data");
    }
    return prisma.user.update({
      where: { id: Number(input.id) },
      data: input.update,
    });
  }

  @Mutation(() => User)
  @UseMiddleware(typeGraphqlAuth)
  async deleteUser(
    @Arg("input", () => DeleteUserInput) input: DeleteUserInput,
    @Ctx() context?: any
  ) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    if (!PermissionService.canDelete(userRole)) {
      throw new Error("Access denied: Insufficient permissions to delete data");
    }
    return await prisma.user.delete({ where: { id: Number(input.id) } });
  }
}

