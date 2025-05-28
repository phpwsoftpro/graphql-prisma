import { Field, InputType } from "type-graphql";

@InputType()
export class CreateQuoteInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  subTotal: number;

  @Field()
  total: number;

  @Field({ nullable: true })
  tax?: number;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field({ nullable: true })
  contactId?: number;
}

@InputType()
export class UpdateQuoteInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  subTotal?: number;

  @Field({ nullable: true })
  total?: number;

  @Field({ nullable: true })
  tax?: number;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field({ nullable: true })
  contactId?: number;
}
