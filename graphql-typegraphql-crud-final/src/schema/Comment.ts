import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: number;

  @Field()
  comment: string;

  @Field()
  createdById: number;

  @Field({ nullable: true })
  taskId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
