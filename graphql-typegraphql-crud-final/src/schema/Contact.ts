import { Field, ID, ObjectType } from "type-graphql";
import { Company } from "./Company";

@ObjectType()
export class Contact {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
