import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Quote {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  subTotal: number;

  @Field()
  total: number;

  @Field()
  tax: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field({ nullable: true })
  contactId?: number;
}
