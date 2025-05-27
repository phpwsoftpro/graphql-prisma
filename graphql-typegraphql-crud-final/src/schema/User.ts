import { Field, ID, ObjectType, InputType } from "type-graphql"

@ObjectType()
export class User {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field()
  role: string

  @Field({ nullable: true })
  jobTitle?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
export class CreateUserInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  jobTitle?: string
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  jobTitle?: string
}
