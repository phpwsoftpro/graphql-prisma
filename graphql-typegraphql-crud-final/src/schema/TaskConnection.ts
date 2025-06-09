import { ObjectType, Field, Int } from "type-graphql";
import { Task } from "./Task";

@ObjectType()
export class TaskConnection {
  @Field(() => [Task])
  nodes: Task[];

  @Field(() => Int)
  totalCount: number;
} 