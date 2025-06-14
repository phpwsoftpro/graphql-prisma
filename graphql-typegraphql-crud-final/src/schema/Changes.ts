import { Field, ObjectType } from "type-graphql";

//changes
@ObjectType()
export class Changes {
  @Field(() => String)
  field: string;

  @Field(() => String)
  from: string;

  @Field(() => String)
  to: string;
}