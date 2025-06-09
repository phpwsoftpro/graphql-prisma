import { Field, ID, ObjectType } from "type-graphql";
import { TaskStage } from "./TaskStage";
import { Comment } from "./Comment";
import { Checklist } from "./Checklist";
import { Project } from "./Project";
import { User } from "./User";
import { CommentConnection } from "./CommentConnection";
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
  @Field(() => CommentConnection, { nullable: true })
  comments?: CommentConnection;
  //checklist
  @Field(() => [Checklist], { nullable: true })
  checklist?: Checklist[];
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
