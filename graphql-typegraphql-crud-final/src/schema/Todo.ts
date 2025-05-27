import { Field, ID, ObjectType } from "type-graphql"

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  title: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  completedAt?: Date
}
