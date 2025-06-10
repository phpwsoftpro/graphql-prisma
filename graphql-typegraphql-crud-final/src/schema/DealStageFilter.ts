import { InputType, Field } from "type-graphql";
import { TitleInFilter } from "./StringTitleInFilter";

@InputType()
class IdInFilter {
  @Field(() => [String], { nullable: true })
  in?: string[];
}

@InputType()
export class DealStageFilter {
  @Field(() => TitleInFilter, { nullable: true })
  title?: TitleInFilter;

  @Field(() => IdInFilter, { nullable: true })
  id?: IdInFilter;
} 