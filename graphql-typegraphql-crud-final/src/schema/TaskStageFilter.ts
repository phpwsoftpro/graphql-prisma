import { InputType, Field } from "type-graphql";
import { TitleInFilter } from "./StringTitleInFilter";

@InputType()
export class TaskStageFilter {
  @Field(() => TitleInFilter, { nullable: true })
  title?: TitleInFilter;
} 