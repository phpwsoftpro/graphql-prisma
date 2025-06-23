import { Field, ID, ObjectType, InputType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  
}

