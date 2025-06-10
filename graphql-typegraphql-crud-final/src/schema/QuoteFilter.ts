import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
class QuoteCompanyIdFilter {
  @Field({ nullable: true })
  eq?: string;
}

@InputType()
class QuoteCompanyFilter {
  @Field(() => QuoteCompanyIdFilter, { nullable: true })
  id?: QuoteCompanyIdFilter;
}

@InputType()
export class QuoteFilter {
  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  description?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  status?: StringFilter;

  @Field(() => QuoteCompanyFilter, { nullable: true })
  company?: QuoteCompanyFilter;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field({ nullable: true })
  contactId?: number;
} 