import { ObjectType, Field, Int } from "type-graphql";
import { Comment } from "./Comment";

@ObjectType()
export class CommentListResponse {
  @Field(() => [Comment])
  nodes: Comment[];

  @Field(() => Int)
  totalCount: number;
} 