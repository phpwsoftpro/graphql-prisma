import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";
import { IdFilter } from "./IdFilter";

@InputType()
export class ContactFilterCompanyFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class ContactFilter {
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  phone?: StringFilter;

  @Field(() => ContactFilterCompanyFilter, { nullable: true })
  company?: ContactFilterCompanyFilter;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => StringFilter, { nullable: true })
  jobTitle?: StringFilter;

  @Field({ nullable: true })
  salesOwnerId?: number;
}
