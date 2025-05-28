import { Field, ID, ObjectType } from "type-graphql";

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

  @Field({ nullable: true })
  projectId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
