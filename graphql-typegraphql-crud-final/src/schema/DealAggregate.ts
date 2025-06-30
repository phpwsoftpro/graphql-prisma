import { ObjectType, Field, Float, Int } from "type-graphql";

@ObjectType()
export class DealAggregateSum {
  @Field(() => Float, { nullable: true })
  value?: number;
}

@ObjectType()
export class DealAggregateGroupBy {
  @Field(() => Int, { nullable: true })
  closeDateMonth?: number;

  @Field(() => Int, { nullable: true })
  closeDateYear?: number;
}

@ObjectType()
export class DealAggregate {
  @Field(() => [DealAggregateGroupBy], { nullable: true })
  groupBy?: DealAggregateGroupBy[];

  @Field(() => DealAggregateSum, { nullable: true })
  sum?: DealAggregateSum;
}