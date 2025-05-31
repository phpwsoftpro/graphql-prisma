import { Field, InputType } from "type-graphql";

@InputType()
export class CompanyFilter {
  @Field({ nullable: true })
  name?: string;
}
