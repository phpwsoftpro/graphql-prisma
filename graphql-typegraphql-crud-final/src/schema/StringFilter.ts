import { Field, InputType } from "type-graphql";

@InputType()
export class StringFilter {
  @Field({ nullable: true })
  equals?: string;

  @Field({ nullable: true })
  contains?: string;

  @Field({ nullable: true })
  startsWith?: string;

  @Field({ nullable: true })
  endsWith?: string;

  @Field({ nullable: true })
  iLike?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];

  @Field({ nullable: true })
  not?: string;
  @Field({ nullable: true })
  eq?: string;

  @Field({ nullable: true })
  ne?: string;

  @Field({ nullable: true })
  gt?: string;
  
} 