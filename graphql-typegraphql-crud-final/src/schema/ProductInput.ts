import { Field, InputType } from "type-graphql";

@InputType()
export class CreateProductInput {
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

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  quantityOnHand?: string;

  @Field({ nullable: true })
  forecastedQuantity?: string;

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
  title?: string;

  @Field({ nullable: true })
  internalReference?: string;

  @Field({ nullable: true })
  responsible?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  productTags?: string;

  @Field({ nullable: true })
  unitPrice?: number;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  quantityOnHand?: string;

  @Field({ nullable: true })
  forecastedQuantity?: string;

  @Field({ nullable: true })
  unitOfMeasure?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  status?: string;
}
