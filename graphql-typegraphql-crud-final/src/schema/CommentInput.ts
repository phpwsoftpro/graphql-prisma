import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
  @Field()
  comment: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  taskId?: number;
}

@InputType()
export class UpdateCommentInput {
  @Field({ nullable: true })
  comment?: string;

  @Field({ nullable: true })
  createdById?: number;

  @Field({ nullable: true })
  taskId?: number;
}
