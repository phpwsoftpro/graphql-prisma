import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCategoryInput {
  @Field()
  title: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  title?: string;
}
