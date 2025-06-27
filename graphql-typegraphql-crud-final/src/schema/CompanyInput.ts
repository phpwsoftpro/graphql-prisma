import { InputType, Field, ID } from "type-graphql";
import { BusinessType, CompanySize, Industry } from "./enums";

@InputType()
export class CreateCompanyInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  totalRevenue?: number;

  @Field(() => Industry, { nullable: true })
  industry?: Industry;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field(() => BusinessType, { nullable: true })
  businessType?: BusinessType;

  @Field(() => ID, { nullable: true })
  salesOwnerId?: number;
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  totalRevenue?: number;

  @Field(() => Industry, { nullable: true })
  industry?: Industry;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field(() => BusinessType, { nullable: true })
  businessType?: BusinessType;

  @Field(() => ID, { nullable: true })
  salesOwnerId?: number;
}

@InputType()
export class CreateOneCompanyInput {
  @Field(() => CreateCompanyInput)
  company: CreateCompanyInput;
}

@InputType()
export class UpdateCompanyInputWrapper {
  @Field()
  id: number;

  @Field(() => UpdateCompanyInput)
  update: UpdateCompanyInput;
}

@InputType()
export class DeleteCompanyInput {
  @Field()
  id: number;
}
