import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class DealStageSummary {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  totalAmount: number;
}
