import { InputType, Field, Int } from "type-graphql";
import { DateTimeFilter } from "./DateTimeFilter";
import { StringFilter } from "./StringFilter";
import { DealStageFilter } from "./DealStageFilter";

@InputType()
class DealCompanyIdFilter {
  @Field({ nullable: true })
  eq?: string;
}

@InputType()
class DealCompanyFilter {
  @Field(() => DealCompanyIdFilter, { nullable: true })
  id?: DealCompanyIdFilter;
}



@InputType()
export class DealFilter {
  @Field(() => DealCompanyFilter, { nullable: true })
  company?: DealCompanyFilter;

  @Field(() => StringFilter, { nullable: true })
  title?: StringFilter;

  @Field(() => DealStageFilter, { nullable: true })
  stage?: DealStageFilter;

  @Field({ nullable: true })
  stageId?: number;
  // Thêm các trường filter khác nếu cần
  //createdAt
  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;
  //updatedAt
  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
} 