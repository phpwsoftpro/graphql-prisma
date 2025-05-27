import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { PrismaClient } from "@prisma/client"
import { Todo } from "../schema/Todo"

const prisma = new PrismaClient()

@Resolver(of => Todo)
export class TodoResolver {
  @Query(() => [Todo])
  async todos() {
    return prisma.todo.findMany()
  }

  @Mutation(() => Todo)
  async createTodo(
    @Arg("title") title: string,
    @Arg("content", { nullable: true }) content: string
  ) {
    return prisma.todo.create({
      data: { title, content },
    })
  }
}
