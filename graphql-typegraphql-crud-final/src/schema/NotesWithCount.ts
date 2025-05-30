import { Field, ObjectType } from "type-graphql";
import { Note } from "./Note";

@ObjectType()
export class NotesWithCount {
  @Field(() => [Note])
  notes: Note[];

  @Field()
  totalCount: number;
}
