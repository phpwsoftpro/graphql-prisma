import { Field, ID, ObjectType } from "type-graphql";
import { Contact } from "./Contact";
import { User } from "./User";

@ObjectType()
export class Company {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  companySize?: string;

  @Field({ nullable: true })
  businessType?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field(() => User, { nullable: true })
  salesOwner?: User;

  @Field(() => [Contact])
  contacts!: Contact[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
