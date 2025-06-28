import { Field, ID, ObjectType, Int, Float } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field(() => [String])
  productTags: string[];

  @Field(() => Float)
  salesPrice: number;

  @Field(() => Float)
  cost: number;

  @Field(() => Int)
  quantityOnHand: number;

  @Field(() => Int)
  forecastedQuantity: number;

  @Field()
  unitOfMeasure: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
