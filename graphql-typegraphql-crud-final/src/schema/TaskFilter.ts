import { InputType, Field, Int } from "type-graphql";
import { StringFilter } from "./StringFilter";

@InputType()
export class TaskFilter {
  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => Int, { nullable: true })
  stageId?: number;
  // Thêm các trường filter khác nếu cần
} 