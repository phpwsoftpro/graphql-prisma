import { Field, InputType } from "type-graphql";

@InputType()
export class IntFilter {
  @Field({ nullable: true })
  eq?: number;

  @Field({ nullable: true })
  neq?: number;

  @Field({ nullable: true })
  gt?: number;

  @Field({ nullable: true })
  gte?: number;

  @Field({ nullable: true })
  lt?: number;

  @Field({ nullable: true })
  lte?: number;

  @Field(() => [Number], { nullable: true })
  in?: number[];

  @Field(() => [Number], { nullable: true })
  notIn?: number[];
} 