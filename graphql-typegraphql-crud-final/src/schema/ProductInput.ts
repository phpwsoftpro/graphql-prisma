import { Field, InputType, ID } from "type-graphql";

@InputType()
export class CreateProductInput {
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

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  quantityOnHand?: number;

  @Field({ nullable: true })
  forecastedQuantity?: number;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  productTags?: string;

  @Field({ nullable: true })
  salesPrice?: number;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  quantityOnHand?: number;

  @Field({ nullable: true })
  forecastedQuantity?: number;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  id: string;
}
