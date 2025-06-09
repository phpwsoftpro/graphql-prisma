import { Field, InputType, Int } from "type-graphql";

@InputType()
export class TaskInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  completed?: boolean;

  @Field(() => Int, { nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  projectId?: number;

  @Field(() => [Int], { nullable: true })
  userIds?: number[];
}

@InputType()
export class UpdateTaskInput {
  @Field(() => Int)
  id: number;

  @Field(() => TaskInput)
  update: TaskInput;
}
// create task input
@InputType()
export class CreateTaskInput {
  @Field(() => TaskInput)
  task: TaskInput;
}