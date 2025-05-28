import { Field, InputType } from "type-graphql";

@InputType()
export class CreateChecklistInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  checked?: boolean;

  @Field()
  taskId: number;
}

@InputType()
export class UpdateChecklistInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  checked?: boolean;

  @Field({ nullable: true })
  taskId?: number;
}
