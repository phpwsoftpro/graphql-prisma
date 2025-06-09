import { Field, InputType } from "type-graphql";

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

  @Field({ nullable: true })
  note?: string;

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
}

@InputType()
export class DeleteNoteInput {
  @Field()
  id: number;
}
