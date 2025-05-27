import { Field, InputType } from "type-graphql"

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
