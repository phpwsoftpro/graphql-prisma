import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Deal } from "../schema/Deal";
import { CreateDealInput, UpdateDealInput } from "../schema/DealInput";

const prisma = new PrismaClient();

@Resolver(() => Deal)
export class DealResolver {
  @Query(() => [Deal])
  async deals() {
    return prisma.deal.findMany({
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Query(() => Deal, { nullable: true })
  async deal(@Arg("id", () => ID) id: number) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Mutation(() => Deal)
  async createDeal(@Arg("data") data: CreateDealInput) {
    return prisma.deal.create({
      data,
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Mutation(() => Deal, { nullable: true })
  async updateDeal(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateDealInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateDealInput;

    return prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteDeal(@Arg("id", () => ID) id: number) {
    await prisma.deal.delete({ where: { id } });
    return true;
  }
}
