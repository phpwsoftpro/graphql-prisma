import { Field, ID, ObjectType } from "type-graphql";
import { Contact } from "./Contact";

@ObjectType()
export class CompanyWithContacts {
  @Field(() => ID)
  id: number;

  @Field(() => [Contact])
  contacts: Contact[];
}

@ObjectType()
export class DealDetail {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  value?: number;

  @Field({ nullable: true })
  dealOwnerId?: number;

  @Field(() => CompanyWithContacts, { nullable: true })
  company?: CompanyWithContacts | null;

  @Field(() => Contact, { nullable: true })
  dealContact?: Contact | null;
}
