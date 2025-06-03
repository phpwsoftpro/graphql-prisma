import { Field, InputType, ID } from "type-graphql";

@InputType()
export class QuoteInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

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
export class CreateQuoteInput {
  @Field(() => QuoteInput)
  quote: QuoteInput;
}

@InputType()
export class UpdateQuoteInput {
  @Field(() => ID)
  id: number;

  @Field(() => QuoteInput)
  update: QuoteInput;
}
