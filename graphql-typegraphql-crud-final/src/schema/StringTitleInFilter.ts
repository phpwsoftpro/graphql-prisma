import { InputType, Field } from "type-graphql";

@InputType()
export class TitleInFilter {
  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];

  @Field({ nullable: true })
  eq?: string;
} 