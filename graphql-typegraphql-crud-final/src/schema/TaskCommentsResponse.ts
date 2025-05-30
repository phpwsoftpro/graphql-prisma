import { Field, ObjectType } from "type-graphql";
import { Comment } from "./Comment";

@ObjectType()
export class TaskCommentsResponse {
  @Field(() => [Comment])
  comments: Comment[];

  @Field()
  totalCount: number;
}
