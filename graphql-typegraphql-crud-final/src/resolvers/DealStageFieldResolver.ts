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
    
    // Always return at least one object with sum 0, even when there are no deals
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    if (!deals.length) {
      return [{
        groupBy: { 
          closeDateMonth: month, 
          closeDateYear: year 
        },
        sum: { 
          value: 0 
        },
      }];
    }
    
    // Calculate total sum for all deals in this stage
    const totalSum = deals.reduce((sum: number, deal: any) => sum + deal.amount, 0);
    
    // Get the most recent deal's date for grouping, or use current date if no deals have dates
    const mostRecentDeal = deals.reduce((latest: any, deal: any) => {
      if (!latest || (deal.updatedAt && deal.updatedAt > latest.updatedAt)) {
        return deal;
      }
      return latest;
    }, null as any);
    
    const date = mostRecentDeal?.updatedAt || now;
    const dealMonth = date.getMonth() + 1;
    const dealYear = date.getFullYear();
    
    return [{
      groupBy: { 
        closeDateMonth: dealMonth, 
        closeDateYear: dealYear 
      },
      sum: { 
        value: totalSum 
      },
    }];
  }
} 