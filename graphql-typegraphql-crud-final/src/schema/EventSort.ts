import { Field, InputType } from "type-graphql";

@InputType()
export class EventSort {
  @Field()
  field: string;

  @Field()
  direction: string;
} 