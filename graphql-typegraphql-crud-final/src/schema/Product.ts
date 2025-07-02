import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  productTags?: string;

  @Field()
  salesPrice: number;

  @Field()
  cost: number;

  @Field({ nullable: true })
  quantityOnHand?: number;

  @Field({ nullable: true })
  forecastedQuantity?: number;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
