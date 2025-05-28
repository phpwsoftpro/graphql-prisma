import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Token, CreateTokenInput, UpdateTokenInput } from "../schema/Token";

const prisma = new PrismaClient();

@Resolver(() => Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens() {
    return prisma.token.findMany();
  }

  @Query(() => Token, { nullable: true })
  async token(@Arg("id", () => ID) id: number) {
    return prisma.token.findUnique({ where: { id } });
  }

  @Mutation(() => Token)
  async createToken(@Arg("data") data: CreateTokenInput) {
    return prisma.token.create({ data });
  }

  @Mutation(() => Token, { nullable: true })
  async updateToken(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateTokenInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateTokenInput;

    return prisma.token.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteToken(@Arg("id", () => ID) id: number) {
    await prisma.token.delete({ where: { id } });
    return true;
  }
}
