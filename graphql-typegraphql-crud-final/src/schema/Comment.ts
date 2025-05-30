import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  @Field()
  comment: string;

  @Field()
  createdById: number;

  @Field(() => User)
  createdBy: User;

  @Field({ nullable: true })
  taskId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
