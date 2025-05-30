import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Deal } from "../schema/Deal";
import { CreateDealInput, UpdateDealInput } from "../schema/DealInput";
import { DealDetail, CompanyWithContacts } from "../schema/DealDetail";

const prisma = new PrismaClient();

@Resolver(() => Deal)
export class DealResolver {
  @Query(() => [Deal])
  async deals() {
    return prisma.deal.findMany();
  }

  @Query(() => Deal, { nullable: true })
  async deal(@Arg("id", () => ID) id: number) {
    return prisma.deal.findUnique({ where: { id } });
  }

  @Query(() => DealDetail, { nullable: true })
  async dealDetail(@Arg("id", () => ID) id: number) {
    const result = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            contacts: true,
          },
        },
        contact: {
          select: { id: true },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      title: result.title,
      stageId: result.stageId ?? undefined,
      value: result.amount,
      dealOwnerId: result.salesOwnerId ?? undefined,
      company: result.company
        ? { id: result.company.id, contacts: result.company.contacts }
        : null,
      dealContact: result.contact ? { id: result.contact.id } : null,
    } as DealDetail;
  }

  @Mutation(() => Deal)
  async createDeal(@Arg("data") data: CreateDealInput) {
    return prisma.deal.create({ data });
  }

  @Mutation(() => Deal, { nullable: true })
  async updateDeal(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateDealInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateDealInput;

    return prisma.deal.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteDeal(@Arg("id", () => ID) id: number) {
    await prisma.deal.delete({ where: { id } });
    return true;
  }
}
