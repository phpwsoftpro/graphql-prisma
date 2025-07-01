import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
export class ProductFilter {
  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  status?: StringFilter;
}
