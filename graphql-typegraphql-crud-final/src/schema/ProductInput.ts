import { Field, InputType } from "type-graphql";

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  unitPrice: number;

  @Field({ nullable: true })
  categoryId?: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  unitPrice?: number;

  @Field({ nullable: true })
  categoryId?: number;
}
