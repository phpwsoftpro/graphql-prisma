import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
export class EventCategoryFilter {
  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  description?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  color?: StringFilter;
} 