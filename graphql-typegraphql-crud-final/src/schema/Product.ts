import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  categoryId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
