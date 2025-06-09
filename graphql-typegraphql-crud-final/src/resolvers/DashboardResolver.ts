import { Arg, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { DealStageSummary } from "../schema/DealStageSummary";
import { DealStageFilter } from "../schema/DealStageFilter";
import { DealStageSort } from "../schema/DealStageSort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver()
export class DashboardResolver {
  @Query(() => [DealStageSummary])
  async dealStageSummary(
    @Arg("filter", () => DealStageFilter) filter: DealStageFilter,
    @Arg("sorting", () => [DealStageSort], { nullable: true }) sorting: DealStageSort[] = [],
    @Arg("paging", () => OffsetPaging) paging: OffsetPaging
  ): Promise<DealStageSummary[]> {
    // Build Prisma where from filter
    const where: any = {};
    if (filter?.title?.eq) {
      where.stage = { title: filter.title.eq };
    } else {
      if (filter?.title?.in) {
        where.stage = { title: { in: filter.title.in } };
      }
      if (filter?.title?.notIn) {
        where.stage = { title: { notIn: filter.title.notIn } };
      }
    }
    // Add more filter fields as needed

    // Build orderBy from sorting
    const orderBy = sorting?.map((s) => ({
      [s.field]: s.direction.toLowerCase(),
    })) ?? [];

    // Paging
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    
    const deals = await prisma.deal.findMany({
      include: { stage: true },
      where,
      orderBy,
      skip,
      take,
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
