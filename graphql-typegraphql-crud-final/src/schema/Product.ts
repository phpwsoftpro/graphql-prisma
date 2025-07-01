import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  productTags?: string;

  @Field()
  unitPrice: number;

  @Field()
  cost: number;

  @Field({ nullable: true })
  quantityOnHand?: string;

  @Field({ nullable: true })
  forecastedQuantity?: string;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
