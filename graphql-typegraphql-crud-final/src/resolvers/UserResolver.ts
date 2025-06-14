import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { User } from "../schema/User";
import { CreateUserInput, UpdateUserInput } from "../schema/UserInput";
import { LoginPayload } from "../schema/LoginPayload";
import { UserListResponse } from "../schema/UserListResponse";
import { UserFilter } from "../schema/UserFilter";
import { UserSort } from "../schema/UserSort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => User)
export class UserResolver {
  @Query(() => UserListResponse)
  async users(
    @Arg("filter", () => UserFilter, { nullable: true }) filter: UserFilter,
    @Arg("sorting", () => [UserSort], { nullable: true }) sorting: UserSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
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
  async user(@Arg("id", () => ID) id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    return prisma.user.create({ data });
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateUserInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateUserInput;

    return prisma.user.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: number) {
    await prisma.user.delete({ where: { id } });
    return true;
  }

  @Mutation(() => LoginPayload)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginPayload> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    const tokenValue = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.token.create({
      data: {
        token: tokenValue,
        type: "login",
        expires,
        userId: user.id,
      },
    });

    return { token: tokenValue, expires };
  }

  @Mutation(() => LoginPayload)
  async refreshToken(
    @Arg("refreshToken") refreshToken: string
  ): Promise<LoginPayload> {
    const existing = await prisma.token.findFirst({
      where: {
        token: refreshToken,
        type: "login",
        blacklisted: false,
      },
    });

    if (!existing || existing.expires < new Date()) {
      throw new Error("Invalid or expired token");
    }

    const newTokenValue = randomBytes(32).toString("hex");
    const newExpires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.token.update({
      where: { id: existing.id },
      data: {
        token: newTokenValue,
        expires: newExpires,
      },
    });

    return { token: newTokenValue, expires: newExpires };
  }
}

