import { Field, ID, ObjectType, InputType } from "type-graphql";
import { UserRole } from "../enums/UserRole";

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

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  
}

