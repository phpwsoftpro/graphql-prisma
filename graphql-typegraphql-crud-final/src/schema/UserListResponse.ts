import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class UserListResponse {
  @Field(() => [User])
  nodes: User[];

  @Field()
  totalCount: number;
} 