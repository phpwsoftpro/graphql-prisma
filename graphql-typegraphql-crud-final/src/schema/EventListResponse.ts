import { Field, ObjectType } from "type-graphql";
import { Event } from "./Event";

@ObjectType()
export class EventListResponse {
  @Field(() => [Event])
  nodes: Event[];

  @Field()
  totalCount: number;
} 