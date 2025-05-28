import { Field, InputType } from "type-graphql";

@InputType()
export class CreateNotificationInput {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  read?: boolean;

  @Field()
  userId: number;
}

@InputType()
export class UpdateNotificationInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  read?: boolean;

  @Field({ nullable: true })
  userId?: number;
}
