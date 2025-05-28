import { Arg, ID, Mutation, Query, Resolver } from "type-graphql"
import { PrismaClient } from "@prisma/client"
import { Todo } from "../schema/Todo"
import { CreateTodoInput, UpdateTodoInput } from "../schema/TodoInput"

const prisma = new PrismaClient()

@Resolver(() => Todo)
export class TodoResolver {
  @Query(() => [Todo])
  async todos() {
    return prisma.todo.findMany()
  }

  @Query(() => Todo, { nullable: true })
  async todo(@Arg("id", () => ID) id: number) {
    return prisma.todo.findUnique({ where: { id } })
  }

  @Mutation(() => Todo)
  async createTodo(@Arg("data") data: CreateTodoInput) {
    return prisma.todo.create({ data })
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodo(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateTodoInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateTodoInput

    return prisma.todo.update({ where: { id }, data: updateData })
  }

  @Mutation(() => Boolean)
  async deleteTodo(@Arg("id", () => ID) id: number) {
    await prisma.todo.delete({ where: { id } })
    return true
  }
}
