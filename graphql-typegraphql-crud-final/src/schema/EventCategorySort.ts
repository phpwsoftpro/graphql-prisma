import { Field, InputType } from "type-graphql";

@InputType()
export class EventCategorySort {
  @Field()
  field: string;

  @Field()
  direction: string;
} 