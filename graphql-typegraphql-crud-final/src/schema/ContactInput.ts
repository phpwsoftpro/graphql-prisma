import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ContactInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  salesOwnerId?: number;
}

@InputType()
export class CreateContactInput {
  @Field(() => ContactInput)
  contact: ContactInput;
}

@InputType()
export class UpdateContactInput {
  @Field(() => ID)
  id: number;

  @Field(() => ContactInput)
  update: ContactInput;
}
