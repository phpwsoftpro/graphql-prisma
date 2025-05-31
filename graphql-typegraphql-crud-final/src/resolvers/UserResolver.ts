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
    
    if (filter) {
      if (filter.name) {
        if (filter.name.iLike) {
          where.name = { contains: filter.name.iLike, mode: 'insensitive' };
        } else if (filter.name.contains) {
          where.name = { contains: filter.name.contains };
        } else if (filter.name.equals) {
          where.name = filter.name.equals;
        }
      }
      
      if (filter.email) {
        if (filter.email.iLike) {
          where.email = { contains: filter.email.iLike, mode: 'insensitive' };
        } else if (filter.email.contains) {
          where.email = { contains: filter.email.contains };
        } else if (filter.email.equals) {
          where.email = filter.email.equals;
        }
      }
      
      if (filter.role) {
        if (filter.role.iLike) {
          where.role = { contains: filter.role.iLike, mode: 'insensitive' };
        } else if (filter.role.contains) {
          where.role = { contains: filter.role.contains };
        } else if (filter.role.equals) {
          where.role = filter.role.equals;
        }
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

