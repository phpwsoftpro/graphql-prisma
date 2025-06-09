import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
export class AuditFilter {
  @Field(() => StringFilter, { nullable: true })
  action?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  targetEntity?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  targetId?: StringFilter;
}