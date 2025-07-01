import { Field, ObjectType } from "type-graphql";
import { Product } from "./Product";

@ObjectType()
export class ProductListResponse {
  @Field(() => [Product])
  nodes: Product[];

  @Field()
  totalCount: number;
}
