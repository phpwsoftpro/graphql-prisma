import { Field, InputType } from "type-graphql";

@InputType()
export class ContactSort {
  @Field()
  field: string;

  @Field()
  direction: "asc" | "desc";
} 