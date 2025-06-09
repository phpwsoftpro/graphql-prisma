import { ObjectType, Field, Int } from "type-graphql";
import { Audit } from "./Audit";

@ObjectType()
export class AuditConnection {
  @Field(() => [Audit])
  nodes: Audit[];

  @Field(() => Int)
  totalCount: number;
} 