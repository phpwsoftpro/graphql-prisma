import { Field, ID, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
 class IdFilter {
  @Field({ nullable: true })
  eq?: number;
}

@InputType()
export class ContactRelationFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class CompanyRelationFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class NoteFilter {
  @Field({ nullable: true })
  id?: number;

  @Field(() => StringFilter, { nullable: true })
  note?: StringFilter;

  @Field(() => CompanyRelationFilter, { nullable: true })
  company?: CompanyRelationFilter;

  @Field(() => ContactRelationFilter, { nullable: true })
  contact?: ContactRelationFilter;

  @Field({ nullable: true })
  createdById?: number;
}

@InputType()
export class NoteSort {
  @Field()
  field: string;

  @Field()
  direction: string;
}

@InputType()
export class NoteInput {
  @Field()
  note: string;

  @Field(() => ID, { nullable: true })
  companyId?: number;

  @Field(() => ID, { nullable: true })
  contactId?: number;

  @Field({ nullable: true })
  createdById?: number;
}

@InputType()
export class CreateNoteInput {
  @Field(() => NoteInput)
  note: NoteInput;
}

@InputType()
export class UpdateNoteInput {
  @Field(() => ID)
  id: number;

  @Field(() => NoteInput)
  update: NoteInput;
}

@InputType()
export class DeleteNoteInput {
  @Field()
  id: number;
}
