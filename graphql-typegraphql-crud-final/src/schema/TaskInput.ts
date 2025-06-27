import { Field, InputType, Int } from "type-graphql";
import { GraphQLJSON } from "graphql-type-json";

@InputType()
export class ChecklistItemInput {
  @Field()
  title: string;

  @Field()
  checked: boolean;
}

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
  //string 
  @Field(() => [String], { nullable: true })
  userIds?:   string[];
  //checklist
  @Field(() => [ChecklistItemInput], { nullable: true })
  checklist?: ChecklistItemInput[];
}
//type là any được không  
@InputType()
export class UpdateTaskInput {
  @Field(() => String)
  id: string;

  @Field(() => TaskInput)
  update: TaskInput;
}
// create task input
@InputType()
export class CreateTaskInput {
  @Field(() => TaskInput)
  task: TaskInput;
}
//delete task input
@InputType()
export class DeleteTaskInput {
  @Field(() => String)
  id: string;
}