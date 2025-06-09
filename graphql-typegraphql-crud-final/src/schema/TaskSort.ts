import { InputType, Field } from "type-graphql";

@InputType()
export class TaskSort {
  @Field()
  field: string;

  @Field()
  direction: string;
} 