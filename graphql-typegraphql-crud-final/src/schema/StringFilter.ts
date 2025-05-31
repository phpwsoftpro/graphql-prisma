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
} 