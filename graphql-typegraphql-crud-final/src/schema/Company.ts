import { Field, ID, ObjectType } from "type-graphql";
import { Contact } from "./Contact";
import { User } from "./User";
import { ContactListResponse } from "./ContactListResponse";
import { DealAggregate } from "./DealAggregate";
import { BusinessType, CompanySize, Industry } from "./enums";


@ObjectType()
export class Company {
  @Field(() => ID)
  id: number;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field(() => BusinessType, { nullable: true })
  businessType?: BusinessType;

  @Field(() => Number, { nullable: true })
  salesOwnerId?: number;

  @Field(() => User, { nullable: true })
  salesOwner?: User | null;

  @Field(() => ContactListResponse, { nullable: true })
  contacts?: ContactListResponse;

  @Field(() => [DealAggregate], { nullable: true })
  dealsAggregate?: DealAggregate[];
}
