import { Field, ID, ObjectType } from "type-graphql"

@ObjectType()
export class User {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  role: string

  @Field({ nullable: true })
  jobTitle?: string
}
