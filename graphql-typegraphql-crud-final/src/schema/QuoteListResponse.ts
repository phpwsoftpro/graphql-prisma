import { Field, ObjectType } from "type-graphql";
import { Quote } from "./Quote";

@ObjectType()
export class QuoteListResponse {
  @Field(() => [Quote])
  nodes: Quote[];

  @Field()
  totalCount: number;
} 