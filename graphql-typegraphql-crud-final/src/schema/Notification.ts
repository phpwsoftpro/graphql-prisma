import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  read: boolean;

  @Field()
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
