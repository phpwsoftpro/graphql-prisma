import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
export class UserFilter {
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  role?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  status?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  jobTitle?: StringFilter;

} 