import { Field, ObjectType } from "type-graphql";

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
