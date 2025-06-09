import { Resolver, FieldResolver, Root } from "type-graphql";
import { DealStage } from "../schema/DealStage";
import { DealAggregateGroupBySum } from "../schema/DealAggregateGroupBySum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver(() => DealStage)
export class DealStageFieldResolver {
  @FieldResolver(() => [DealAggregateGroupBySum], { nullable: true })
  async dealsAggregate(@Root() stage: DealStage): Promise<DealAggregateGroupBySum[]> {
    const deals = await prisma.deal.findMany({ where: { stageId: stage.id } });
    if (!deals.length) return [];
    const groupMap = new Map<string, { month: number; year: number; sum: number }>();
    for (const deal of deals) {
      if (!deal.updatedAt) continue;
      const date = deal.updatedAt;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      if (!month || !year) continue;
      const key = `${year}-${month}`;
      const group = groupMap.get(key) || { month, year, sum: 0 };
      group.sum += deal.amount;
      groupMap.set(key, group);
    }
    return Array.from(groupMap.values())
      .filter(g => g.month && g.year)
      .map(g => ({
        groupBy: { closeDateMonth: g.month, closeDateYear: g.year },
        sum: { value: g.sum },
      }));
  }
} 