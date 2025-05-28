import { Field, ID, ObjectType, InputType } from "type-graphql";

@ObjectType()
export class Token {
  @Field(() => ID)
  id: number;

  @Field()
  token: string;

  @Field()
  type: string;

  @Field()
  expires: Date;

  @Field()
  blacklisted: boolean;

  @Field()
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateTokenInput {
  @Field()
  token: string;

  @Field()
  type: string;

  @Field()
  expires: Date;

  @Field({ nullable: true })
  blacklisted?: boolean;

  @Field()
  userId: number;
}

@InputType()
export class UpdateTokenInput {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  expires?: Date;

  @Field({ nullable: true })
  blacklisted?: boolean;

  @Field({ nullable: true })
  userId?: number;
}
