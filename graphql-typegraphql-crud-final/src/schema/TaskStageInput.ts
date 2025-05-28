import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTaskStageInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;
}

@InputType()
export class UpdateTaskStageInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;
}
