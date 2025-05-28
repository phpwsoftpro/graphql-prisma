import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class EventCategory {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;
}
