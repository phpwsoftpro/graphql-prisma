import { ObjectType, Field } from "type-graphql";
import { Deal } from "./Deal";

@ObjectType()
export class DealConnection {
  @Field(() => [Deal])
  nodes: Deal[];

  @Field()
  totalCount: number;
} 