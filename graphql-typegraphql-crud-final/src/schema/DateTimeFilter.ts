import { InputType, Field } from "type-graphql";

@InputType()
export class DateTimeFilter {
  @Field({ nullable: true })
  eq?: Date;

  @Field({ nullable: true })
  gte?: Date;

  @Field({ nullable: true })
  lte?: Date;

  // Thêm các toán tử khác nếu cần
}