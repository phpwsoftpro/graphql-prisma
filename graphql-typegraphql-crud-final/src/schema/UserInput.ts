import { Field, ID, InputType } from "type-graphql"


@InputType()
export class UserInput {
  @Field({ nullable: true })
  name: string

  @Field( { nullable: true })
  email: string

  @Field( { nullable: true })
  password: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  jobTitle?: string
  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  address?: string
}
@InputType()
export class CreateUserInput {
  @Field(() => UserInput)
  user: UserInput
}
@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: number
  @Field(() => UserInput)
  update: UserInput
}
@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  id: string
}