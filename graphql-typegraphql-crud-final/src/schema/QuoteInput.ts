import { Field, InputType, ID } from "type-graphql";

@InputType()
export class QuoteInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  tax?: number;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  salesOwnerId?: string;

  @Field({ nullable: true })
  contactId?: string;
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
//delete quote
@InputType()
export class DeleteQuoteInput {
  @Field(() => ID)
  id: string;
}
