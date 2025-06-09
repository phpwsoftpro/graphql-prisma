import { Field, ObjectType } from "type-graphql";
import { Note } from "./Note";

@ObjectType()
export class NoteListResponse {
  @Field(() => [Note])
  nodes: Note[];

  @Field()
  totalCount: number;
} 