import { Field, InputType } from "type-graphql";
import { BusinessType, CompanySize, Industry } from "./enums";

@InputType()
export class BusinessTypeFilter {
  @Field(() => BusinessType, { nullable: true })
  eq?: BusinessType;

  @Field(() => [BusinessType], { nullable: true })
  in?: BusinessType[];

  @Field(() => BusinessType, { nullable: true })
  neq?: BusinessType;

  @Field(() => [BusinessType], { nullable: true })
  notIn?: BusinessType[];
}

@InputType()
export class CompanySizeFilter {
  @Field(() => CompanySize, { nullable: true })
  eq?: CompanySize;

  @Field(() => [CompanySize], { nullable: true })
  in?: CompanySize[];

  @Field(() => CompanySize, { nullable: true })
  neq?: CompanySize;

  @Field(() => [CompanySize], { nullable: true })
  notIn?: CompanySize[];
}

@InputType()
export class IndustryFilter {
  @Field(() => Industry, { nullable: true })
  eq?: Industry;

  @Field(() => [Industry], { nullable: true })
  in?: Industry[];

  @Field(() => Industry, { nullable: true })
  neq?: Industry;

  @Field(() => [Industry], { nullable: true })
  notIn?: Industry[];
} 