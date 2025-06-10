import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
class ContactIdFilter {
  @Field({ nullable: true })
  eq?: string;
}

@InputType()
class ContactCompanyFilter {
  @Field(() => ContactIdFilter, { nullable: true })
  id?: ContactIdFilter;
}

@InputType()
export class ContactFilter {
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => ContactCompanyFilter, { nullable: true })
  company?: ContactCompanyFilter;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => StringFilter, { nullable: true })
  jobTitle?: StringFilter;

  @Field({ nullable: true })
  salesOwnerId?: number;
}
