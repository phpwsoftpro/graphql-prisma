import { ObjectType, Field, Int } from "type-graphql";
import { TaskStage } from "./TaskStage";

@ObjectType()
export class TaskStageConnection {
  @Field(() => [TaskStage])
  nodes: TaskStage[];

  @Field(() => Int)
  totalCount: number;
} 