import { Field, ObjectType } from "type-graphql";
import { EventCategory } from "./EventCategory";

@ObjectType()
export class EventCategoryConnection {
  @Field(() => [EventCategory])
  nodes: EventCategory[];

  @Field()
  totalCount: number;
}
