import { Field, InputType } from "type-graphql";
//task stage input
@InputType()
export class TaskStageInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;
}
//create task stage input
@InputType()
export class CreateTaskStageInput {
  @Field(() => TaskStageInput)
  taskStage: TaskStageInput;
}

@InputType()
export class UpdateTaskStageInput {
  //id
  @Field(() => String)
  id: string;
  //task stage input
  @Field(() => TaskStageInput)
  update: TaskStageInput;
}
//delete task stage input
@InputType()
export class DeleteTaskStageInput {
  @Field(() => String)
  id: string;
}