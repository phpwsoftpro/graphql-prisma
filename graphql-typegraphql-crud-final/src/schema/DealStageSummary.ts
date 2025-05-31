import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class DealStageSummary {
  @Field()
  stage!: string;

  @Field()
  closeDateMonth!: number;

  @Field()
  closeDateYear!: number;

  @Field()
  value!: number;
}

@ObjectType()
export class DealStageInfo {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  totalAmount!: number;
}
