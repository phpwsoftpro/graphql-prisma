import { Field, InputType } from "type-graphql";

@InputType()
export class QuoteSort {
  @Field()
  field: string;

  @Field()
  direction: string;
} 