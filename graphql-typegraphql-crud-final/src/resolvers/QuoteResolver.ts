import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Quote } from "../schema/Quote";
import { CreateQuoteInput, UpdateQuoteInput } from "../schema/QuoteInput";

const prisma = new PrismaClient();

@Resolver(() => Quote)
export class QuoteResolver {
  @Query(() => [Quote])
  async quotes() {
    return prisma.quote.findMany();
  }

  @Query(() => Quote, { nullable: true })
  async quote(@Arg("id", () => ID) id: number) {
    return prisma.quote.findUnique({ where: { id } });
  }

  @Mutation(() => Quote)
  async createQuote(@Arg("data") data: CreateQuoteInput) {
    return prisma.quote.create({ data });
  }

  @Mutation(() => Quote, { nullable: true })
  async updateQuote(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateQuoteInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateQuoteInput;
    return prisma.quote.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteQuote(@Arg("id", () => ID) id: number) {
    await prisma.quote.delete({ where: { id } });
    return true;
  }
}
