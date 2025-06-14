import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ChecklistItem {
  @Field()
  title: string;

  @Field()
  checked: boolean;
} 