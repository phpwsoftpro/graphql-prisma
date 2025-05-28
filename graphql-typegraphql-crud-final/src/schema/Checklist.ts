import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Checklist {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  checked: boolean;

  @Field()
  taskId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
