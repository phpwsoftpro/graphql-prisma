import { InputType, Field } from "type-graphql";

@InputType()
export class IdFilter {
  @Field({ nullable: true })
  eq?: number;
} 