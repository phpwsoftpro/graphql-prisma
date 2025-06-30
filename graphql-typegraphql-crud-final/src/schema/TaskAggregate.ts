import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class TaskStageTasksCountAggregate {
  @Field(() => Int, { nullable: true })
  id?: number;
}

@ObjectType()
export class TaskStageTasksAggregateResponse {
  @Field(() => TaskStageTasksCountAggregate, { nullable: true })
  count?: TaskStageTasksCountAggregate;
} 