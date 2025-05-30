import { Field, InputType, Int } from "type-graphql";

@InputType()
export class OffsetPaging {
  @Field(() => Int)
  limit: number = 10;

  @Field(() => Int)
  offset: number = 0;
}
