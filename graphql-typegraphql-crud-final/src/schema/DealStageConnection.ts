import { ObjectType, Field } from "type-graphql";
import { DealStage } from "./DealStage";

@ObjectType()
export class DealStageConnection {
  @Field(() => [DealStage])
  nodes: DealStage[];

  @Field()
  totalCount: number;
} 