import { Field, ID, ObjectType, Int } from "type-graphql";
import { DealAggregate } from "./DealAggregate";
import { DealAggregateGroupBySum } from "./DealAggregateGroupBySum";


@ObjectType()
export class DealStage {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [DealAggregateGroupBySum], { nullable: true })
  dealsAggregate?: DealAggregateGroupBySum[];
}
