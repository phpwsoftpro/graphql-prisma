import { Field, ID, ObjectType, Int } from "type-graphql";

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

 
}

@ObjectType()
export class TaskStageConnection {
  @Field(() => [TaskStage])
  nodes: TaskStage[];

  @Field()
  totalCount: number;
}
