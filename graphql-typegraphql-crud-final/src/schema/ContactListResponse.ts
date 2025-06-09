import { Field, ObjectType } from "type-graphql";
import { Contact } from "./Contact";

@ObjectType()
export class  ContactListResponse {
  @Field(() => [Contact])
  nodes: Contact[];

  @Field()
  totalCount: number;
} 