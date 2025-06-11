import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { Task } from "./Task";

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  @Field()
  comment: string;

  @Field({ nullable: true })
  createdById: number;

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field({ nullable: true })
  taskId?: number;
  @Field(() => Task, { nullable: true })
  task?: Task;
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
