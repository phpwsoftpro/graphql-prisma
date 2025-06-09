import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { DealStage } from "../schema/DealStage";
import { DealStageSummary } from "../schema/DealStageSummary";
import { CreateDealStageInput, DeleteDealStageInput, UpdateDealStageInput } from "../schema/DealStageInput";
import { DealStageFilter } from "../schema/DealStageFilter";
import { DealStageSort } from "../schema/DealStageSort";
import { OffsetPaging } from "../schema/PagingInput";
import { DealStageConnection } from "../schema/DealStageConnection";
import { DealAggregate } from "../schema/DealAggregate";

const prisma = new PrismaClient();

@Resolver(() => DealStage)
export class DealStageResolver {
  @Query(() => DealStageConnection)
  async dealStages(
    @Arg("filter", () => DealStageFilter, { nullable: true }) filter: DealStageFilter,
    @Arg("sorting", () => [DealStageSort], { nullable: true }) sorting: DealStageSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<DealStageConnection> {
    const where: any = {};
    if (filter?.title?.in) {
      where.title = { in: filter.title.in };
    }
    if (filter?.title?.notIn) {
      where.title = { notIn: filter.title.notIn };
    }
    // Add more filter fields as needed

    const orderBy = sorting?.map((s) => ({
      [s.field]: (typeof s.direction === "string" && s.direction.toString() === "ASC") ? "asc" : "desc",
    })) ?? [];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.dealStage.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.dealStage.count({ where }),
    ]);

    // Map từng node để thêm dealsAggregate
    const nodesWithAggregate = await Promise.all(
      nodes.map(async (stage) => {
        const sum = await prisma.deal.aggregate({
          where: { stageId: stage.id },
          _sum: { amount: true },
        });
        return {
          ...stage,
          dealsAggregate: [
            { sum: { value: sum._sum.amount ?? 0 } }
          ]
        };
      })
    );

    return { nodes: nodesWithAggregate as any, totalCount };
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
  async createDealStage(@Arg("input") input: CreateDealStageInput) {
    return prisma.dealStage.create({ data: input.dealStage });
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
  async deleteDealStage(@Arg("input") input: DeleteDealStageInput) {
    await prisma.dealStage.delete({ where: { id: input.id } });
    return true;
  }
}
