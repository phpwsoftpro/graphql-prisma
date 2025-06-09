import { Field, InputType } from "type-graphql";
import { DealStage } from "./DealStage";
//dealStage input
@InputType()
export class DealStageInput {
  @Field()
  title: string;
}

@InputType()
export class CreateDealStageInput {
  @Field(() => DealStageInput)
  dealStage: DealStageInput;
}

@InputType()
export class UpdateDealStageInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;
}

@InputType()
export class DeleteDealStageInput {
  @Field()
  id: number;
}
