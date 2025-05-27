import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { User, CreateUserInput, UpdateUserInput } from "../schema/User";

const prisma = new PrismaClient();

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return prisma.user.findMany();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id") id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    return prisma.user.create({ data });
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id") id: number,
    @Arg("data") data: UpdateUserInput
  ) {
    return prisma.user.update({ where: { id }, data });
  }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Arg("id") id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
