import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { DealStage } from "../schema/DealStage";
import { DealStageSummary } from "../schema/DealStageSummary";
import { CreateDealStageInput, UpdateDealStageInput } from "../schema/DealStageInput";

const prisma = new PrismaClient();

@Resolver(() => DealStage)
export class DealStageResolver {
  @Query(() => [DealStage])
  async dealStages() {
    return prisma.dealStage.findMany();
  }

  @Query(() => [DealStageSummary])
  async dealStageSummaries() {
    const stages = await prisma.dealStage.findMany({ select: { id: true, title: true } });

    const sums = await prisma.deal.groupBy({
      by: ["stageId"],
      _sum: { amount: true },
    });

    const sumMap = new Map<number, number>();
    for (const item of sums) {
      if (item.stageId !== null) {
        sumMap.set(item.stageId, item._sum.amount ?? 0);
      }
    }

    return stages.map((stage) => ({
      id: stage.id,
      title: stage.title,
      totalAmount: sumMap.get(stage.id) ?? 0,
    }));
  }

  @Query(() => DealStage, { nullable: true })
  async dealStage(@Arg("id", () => ID) id: number) {
    return prisma.dealStage.findUnique({ where: { id } });
  }

  @Mutation(() => DealStage)
  async createDealStage(@Arg("data") data: CreateDealStageInput) {
    return prisma.dealStage.create({ data });
  }

  @Mutation(() => DealStage, { nullable: true })
  async updateDealStage(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateDealStageInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateDealStageInput;
    return prisma.dealStage.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteDealStage(@Arg("id", () => ID) id: number) {
    await prisma.dealStage.delete({ where: { id } });
    return true;
  }
}
