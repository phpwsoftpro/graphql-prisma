import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  unitPrice: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  categoryId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
