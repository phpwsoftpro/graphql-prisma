import { InputType, Field } from "type-graphql";

@InputType()
export class TaskStageSort {
  @Field()
  field: string;

  @Field()
  direction: string;
} 