import { Field, InputType } from "type-graphql";

@InputType()
export class UserSort {
  @Field()
  field: string;

  @Field()
  direction: "asc" | "desc";
} 