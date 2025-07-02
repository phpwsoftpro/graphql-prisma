import { Field, InputType } from "type-graphql";

@InputType()
export class ProductSort {
  @Field()
  field: string;

  @Field()
  direction: string;
}
