import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Note {
  @Field(() => ID)
  id: number;

  @Field()
  note: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  createdById?: number;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
