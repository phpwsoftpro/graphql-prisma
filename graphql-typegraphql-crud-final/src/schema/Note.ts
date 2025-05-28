import { Field, ID, ObjectType } from "type-graphql";

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
