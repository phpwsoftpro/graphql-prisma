import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { User } from "../schema/User";
import { CreateUserInput, UpdateUserInput } from "../schema/UserInput";
import { LoginPayload } from "../schema/LoginPayload";

const prisma = new PrismaClient();

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return prisma.user.findMany();
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
}

