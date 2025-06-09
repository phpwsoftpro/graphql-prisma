import { Field, ID, ObjectType } from "type-graphql";
import { Company } from "./Company";
import { Contact } from "./Contact";
import { User } from "./User";

@ObjectType()
export class Note {
  @Field(() => ID)
  id: number;

  @Field()
  note: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => Contact, { nullable: true })
  contact?: Contact;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
