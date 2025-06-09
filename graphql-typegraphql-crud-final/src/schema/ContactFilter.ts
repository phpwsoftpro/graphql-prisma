import { Field, InputType } from "type-graphql";

@InputType()
export class ContactFilter {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  salesOwnerId?: number;
}
