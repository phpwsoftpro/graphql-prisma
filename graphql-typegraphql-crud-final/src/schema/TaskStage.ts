import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TaskStage {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  order: number;

  @Field()
  color: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
