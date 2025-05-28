import { Field, InputType } from "type-graphql";

@InputType()
export class CreateEventCategoryInput {
  @Field()
  title: string;
}

@InputType()
export class UpdateEventCategoryInput {
  @Field({ nullable: true })
  title?: string;
}
