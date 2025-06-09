import { ObjectType, Field } from "type-graphql";
import { DealAggregateGroupBy } from "./DealAggregate";
import { DealAggregateSum } from "./DealAggregate";

@ObjectType()
export class DealAggregateGroupBySum {
  @Field(() => DealAggregateGroupBy)
  groupBy: DealAggregateGroupBy;

  @Field(() => DealAggregateSum)
  sum: DealAggregateSum;
} 