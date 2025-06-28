import { Field, InputType, Int, Float } from "type-graphql";

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  internalReference: string;

  @Field()
  responsible: string;

  @Field(() => [String], { nullable: true })
  productTags?: string[];

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  salesPrice: number;

  @Field(() => Float, { nullable: true })
  cost?: number;

  @Field(() => Int, { nullable: true })
  quantityOnHand?: number;

  @Field(() => Int, { nullable: true })
  forecastedQuantity?: number;

  @Field()
  unitOfMeasure: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  categoryId?: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field(() => [String], { nullable: true })
  productTags?: string[];

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  salesPrice?: number;

  @Field(() => Float, { nullable: true })
  cost?: number;

  @Field(() => Int, { nullable: true })
  quantityOnHand?: number;

  @Field(() => Int, { nullable: true })
  forecastedQuantity?: number;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  categoryId?: number;
}
