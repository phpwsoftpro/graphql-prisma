import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "./Product";

@ObjectType()
export class QuoteProduct {
  @Field(() => ID)
  id: number;

  @Field(() => Product)
  product: Product;

  @Field()
  quantity: number;

  @Field()
  discount: number;

  @Field()
  totalPrice: number;
} 