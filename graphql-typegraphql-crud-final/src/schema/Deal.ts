import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Deal {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  amount: number;

  @Field({ name: "value" })
  getValue(): number {
    return this.amount;
  }

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
