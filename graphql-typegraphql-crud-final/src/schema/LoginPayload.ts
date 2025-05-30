import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LoginPayload {
  @Field()
  token: string;

  @Field()
  expires: Date;
}
