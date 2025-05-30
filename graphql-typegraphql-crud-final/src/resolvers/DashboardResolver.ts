import { Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { DealStageSummary } from "../schema/DealStageSummary";

const prisma = new PrismaClient();

@Resolver()
export class DashboardResolver {
  @Query(() => [DealStageSummary])
  async dealStageSummary(): Promise<DealStageSummary[]> {
    const deals = await prisma.deal.findMany({
      include: { stage: true },
      where: { stage: { title: { in: ["WON", "LOST"] } } },
    });

    const summaryMap = new Map<string, DealStageSummary>();

    for (const deal of deals) {
      const date = deal.updatedAt;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const stage = deal.stage?.title ?? "UNKNOWN";
      const key = `${stage}-${year}-${month}`;
      const current = summaryMap.get(key) || {
        stage,
        closeDateMonth: month,
        closeDateYear: year,
        value: 0,
      };
      current.value += deal.amount;
      summaryMap.set(key, current);
    }

    return Array.from(summaryMap.values());
  }
}
