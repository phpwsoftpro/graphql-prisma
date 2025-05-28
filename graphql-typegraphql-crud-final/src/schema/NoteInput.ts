import { Field, InputType } from "type-graphql";

@InputType()
export class CreateNoteInput {
  @Field()
  note: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  createdById?: number;
}

@InputType()
export class UpdateNoteInput {
  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  createdById?: number;
}
