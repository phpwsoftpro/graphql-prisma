import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDealInput {
  @Field()
  title: string;

  @Field()
  amount: number;

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
}

@InputType()
export class UpdateDealInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  amount?: number;

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
}
