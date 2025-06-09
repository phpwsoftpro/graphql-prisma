import { InputType, Field, Int } from "type-graphql";
import { DateTimeFilter } from "./DateTimeFilter";

@InputType()
export class DealFilter {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  stageId?: number;
  // Thêm các trường filter khác nếu cần
  //createdAt
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;
  //updatedAt
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
} 