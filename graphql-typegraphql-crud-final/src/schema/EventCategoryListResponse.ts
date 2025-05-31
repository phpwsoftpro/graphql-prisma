import { Field, ObjectType } from "type-graphql";
import { EventCategory } from "./EventCategory";

@ObjectType()
export class EventCategoryListResponse {
  @Field(() => [EventCategory])
  nodes: EventCategory[];

  @Field()
  totalCount: number;
} 