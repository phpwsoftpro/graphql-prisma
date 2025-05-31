import { Field, ObjectType } from "type-graphql";
import { Company } from "./Company";

@ObjectType()
export class CompanyListResponse {
  @Field(() => [Company])
  nodes: Company[];

  @Field()
  totalCount: number;
}
