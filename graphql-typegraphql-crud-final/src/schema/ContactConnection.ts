import { Field, ObjectType } from "type-graphql";
import { Contact } from "./Contact";

@ObjectType()
export class ContactConnection {
  @Field(() => [Contact])
  nodes: Contact[];

  @Field()
  totalCount: number;
}
