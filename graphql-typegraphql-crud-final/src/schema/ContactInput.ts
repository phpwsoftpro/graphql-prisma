import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ContactCreateInput {
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
export class ContactUpdateInput {
  @Field({ nullable: true })
  name?: string;

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
  @Field(() => ContactCreateInput)
  contact: ContactCreateInput;
}

@InputType()
export class UpdateContactInput {
  @Field(() => ID)
  id: number;

  @Field(() => ContactUpdateInput)
  update: ContactUpdateInput;
}
