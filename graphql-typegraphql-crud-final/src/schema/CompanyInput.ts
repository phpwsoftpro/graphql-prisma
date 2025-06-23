import { InputType, Field, ID } from "type-graphql";

@InputType()
export class CompanyInput {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  industry?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  avatarUrl?: string;
  @Field({ nullable: true })
  website?: string;
  @Field({ nullable: true })
  totalRevenue?: number;
  @Field({ nullable: true })
  companySize?: string;
  @Field({ nullable: true })
  businessType?: string;
  @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  country?: string;
  @Field(() => ID, { nullable: true })
  salesOwnerId?: number;
}

@InputType()
export class CreateOneCompanyInput {
  @Field(() => CompanyInput)
  company: CompanyInput;
}

@InputType()
export class UpdateCompanyInput {
  @Field(() => ID)
  id: number;
  @Field(() => CompanyInput)
  update: CompanyInput;
}

@InputType()
export class DeleteCompanyInput {
  @Field(() => ID)
  id: number;
}
