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
  stageId?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  dealContactId?: string;

  @Field({ nullable: true })
  dealOwnerId?: string;
}
@InputType()
export class CreateDealInput {
  @Field(() => DealInput)
  deal: DealInput;
}

@InputType()
export class UpdateDealInput {
  @Field()
  id: string  ;
  @Field(() => DealInput)
  update: DealInput;
}
