import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";
import { UserFilter } from "./UserFilter";

@InputType()
export class AuditFilter {
  @Field(() => StringFilter, { nullable: true })
  action?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  targetEntity?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  targetId?: StringFilter;

  @Field(() => UserFilter, { nullable: true })
  user?: UserFilter;
}