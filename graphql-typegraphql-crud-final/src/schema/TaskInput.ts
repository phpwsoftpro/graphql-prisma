import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  projectId?: number;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  completed?: boolean;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  projectId?: number;
}
