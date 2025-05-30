import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "./Product";
import { Company } from "./Company";
import { User } from "./User";
import { Contact } from "./Contact";

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

  @Field(() => [Product])
  items?: Product[];

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => User, { nullable: true })
  salesOwner?: User;

  @Field(() => Contact, { nullable: true })
  contact?: Contact;
}
