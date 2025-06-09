import { Field, InputType } from "type-graphql";


@InputType()
export class DealInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  stageId?: number;

  @Field({ nullable: true })
  companyId?: number;

  @Field({ nullable: true })
  dealContactId?: number;

  @Field({ nullable: true })
  dealOwnerId?: number;
}
@InputType()
export class CreateDealInput {
  @Field(() => DealInput)
  deal: DealInput;
}

@InputType()
export class UpdateDealInput {
  @Field()
  id: number;
  @Field(() => DealInput)
  update: DealInput;
}
