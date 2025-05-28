import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDealStageInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  order?: number;

  @Field({ nullable: true })
  color?: string;
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
