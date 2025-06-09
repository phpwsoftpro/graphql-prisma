import { ObjectType, Field, Int, Float } from "type-graphql";

@ObjectType()
export class DealGroupByMonth {
  @Field()
  stage: string;

  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => Float)
  totalValue: number;
} 