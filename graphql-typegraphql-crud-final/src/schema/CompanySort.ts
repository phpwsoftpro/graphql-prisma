import { Field, InputType } from "type-graphql";

@InputType()
export class CompanySort {
  @Field()
  field: string;

  @Field()
  direction: "asc" | "desc";
}
