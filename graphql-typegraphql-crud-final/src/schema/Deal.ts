import { Field, ID, ObjectType } from "type-graphql";
import { Company } from "./Company";
import { User } from "./User";

@ObjectType()
export class Deal {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ name: "value" })
  amount: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  companyId?: number;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field({ nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  salesOwnerId?: number;

  @Field(() => User, { nullable: true, name: "dealOwner" })
  salesOwner?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
