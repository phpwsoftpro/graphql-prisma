import { Field, ID, ObjectType } from "type-graphql";
import { TaskStage } from "./TaskStage";
import { Comment } from "./Comment";
import { Project } from "./Project";
import { User } from "./User";
import { CommentListResponse } from "./CommentListResponse";
import { ChecklistItem } from "./ChecklistItem";
@ObjectType()
export class Task {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  completed: boolean;

  @Field({ nullable: true })
  stageId?: number;
  @Field(() => TaskStage, { nullable: true })
  stage?: TaskStage;
  //comments
  @Field(() => CommentListResponse, { nullable: true })
  comments?: CommentListResponse;
  //checklist json
  @Field(() => [ChecklistItem], { nullable: true })
  checklist?: ChecklistItem[];
  //project
  @Field({ nullable: true })
  projectId?: number;
  @Field(() => Project, { nullable: true })
  project?: Project;
  //users
  @Field(() => [User], { nullable: true })
  users?: User[];
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
