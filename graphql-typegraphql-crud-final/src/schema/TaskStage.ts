import { Field, ID, ObjectType, Int } from "type-graphql";
import { Task } from "./Task";
import { User } from "./User";
import { TaskStageTasksAggregateResponse } from "./TaskAggregate";

@ObjectType()
export class TaskStage {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @Field(() => [TaskStageTasksAggregateResponse], { nullable: true })
  tasksAggregate?: TaskStageTasksAggregateResponse[];

  @Field(() => User, { nullable: true })
  createdBy?: User;

  @Field(() => User, { nullable: true })
  updatedBy?: User;
}

@ObjectType()
export class TaskStageConnection {
  @Field(() => [TaskStage])
  nodes: TaskStage[];

  @Field()
  totalCount: number;
}
