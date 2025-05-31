import { Field, InputType } from "type-graphql";

@InputType()
export class DateFilter {
  @Field({ nullable: true })
  gte?: Date;

  @Field({ nullable: true })
  lte?: Date;
}

@InputType()
export class EventFilter {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => DateFilter, { nullable: true })
  startDate?: DateFilter;

  @Field(() => DateFilter, { nullable: true })
  endDate?: DateFilter;

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  createdById?: number;
} 