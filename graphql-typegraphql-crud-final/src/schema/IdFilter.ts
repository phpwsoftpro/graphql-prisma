import { Field, InputType } from "type-graphql";

@InputType()
export class IdFilter {
  @Field({ nullable: true })
  eq?: string;

  @Field({ nullable: true })
  neq?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];
} 