import { Field, ID, ObjectType } from "type-graphql";
import { Company } from "./Company";
import { User } from "./User";
import { Contact } from "./Contact";
import { QuoteProduct } from "./QuoteProduct";

@ObjectType()
export class Quote {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  subTotal: number;

  @Field()
  total: number;

  @Field()
  tax: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field({ nullable: true })
  contactId?: number;

  @Field(() => [QuoteProduct])
  items?: QuoteProduct[];

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => User, { nullable: true })
  salesOwner?: User;

  @Field(() => Contact, { nullable: true })
  contact?: Contact;
}
