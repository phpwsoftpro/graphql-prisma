import { Field, ID, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";
import { IdFilter } from "./IdFilter";

@InputType()
export class CommentInput {
  @Field()
  comment: string;

  @Field(() => ID, { nullable: true })
  createdById: number;

  @Field(() => ID, { nullable: true })
  taskId: number;
}

//create comment input
@InputType()
export class CreateCommentInput {
  @Field(() => CommentInput)
  comment: CommentInput;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => ID)
  id: number;

  @Field(() => CommentInput)
  update: CommentInput;
}

@InputType()
export class TaskRelationFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class CommentFilter {
  @Field({ nullable: true })
  id?: number;

  @Field(() => StringFilter, { nullable: true })
  comment?: StringFilter;

  @Field(() => TaskRelationFilter, { nullable: true })
  task?: TaskRelationFilter;

  @Field(() => ID, { nullable: true })
  taskId?: number;
  //created by id
  @Field(() => ID, { nullable: true })
  createdById?: number;

}

@InputType()
export class CommentSort {
  @Field()
  field: string;

  @Field()
  direction: string;
}
//delete comment input
@InputType()
export class DeleteCommentInput {
  @Field(() => ID)
  id: number;
}
