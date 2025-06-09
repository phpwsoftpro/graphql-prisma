import { Field, ID, ObjectType } from "type-graphql";
import { Company } from "./Company";
import { User } from "./User";
import { Contact } from "./Contact";
import { DealStage } from "./DealStage";

@ObjectType()
export class Deal {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ name: "value" })
  amount: number;

  @Field({ name: "value" })
  getValue(): number {
    return this.amount;
  }

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  stageId?: number;
  //stage
  @Field(() => DealStage, { nullable: true })
  stage?: DealStage;
  @Field({ nullable: true })
  companyId?: number;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field({ nullable: true })
  dealContactId?: number;

  @Field(() => Contact, { nullable: true })
  dealContact?: Contact;

  @Field({ nullable: true })
  dealOwnerId?: number;

  @Field(() => User, { nullable: true, name: "dealOwner" })
  dealOwner?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
