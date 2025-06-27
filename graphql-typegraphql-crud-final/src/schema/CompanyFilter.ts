import { Field, InputType } from "type-graphql";
import { StringFilter } from "./StringFilter";
import { IdFilter } from "./IdFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { IntFilter } from "./IntFilter";
import { BusinessTypeFilter, CompanySizeFilter, IndustryFilter } from "./EnumFilter";

@InputType()
export class CompanySalesOwnerFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class CompanyFilterContactFilter {
  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;
}

@InputType()
export class CompanyFilter {
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => CompanySalesOwnerFilter, { nullable: true })
  salesOwner?: CompanySalesOwnerFilter;

  @Field(() => CompanyFilterContactFilter, { nullable: true })
  contacts?: CompanyFilterContactFilter;

  @Field(() => StringFilter, { nullable: true })
  country?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  website?: StringFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;

  @Field(() => IntFilter, { nullable: true })
  totalRevenue?: IntFilter;

  @Field(() => IdFilter, { nullable: true })
  id?: IdFilter;

  @Field(() => BusinessTypeFilter, { nullable: true })
  businessType?: BusinessTypeFilter;

  @Field(() => CompanySizeFilter, { nullable: true })
  companySize?: CompanySizeFilter;

  @Field(() => IndustryFilter, { nullable: true })
  industry?: IndustryFilter;
}
