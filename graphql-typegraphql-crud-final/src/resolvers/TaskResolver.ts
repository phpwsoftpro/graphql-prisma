import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Task } from "../schema/Task";
import { CreateTaskInput, UpdateTaskInput } from "../schema/TaskInput";

const prisma = new PrismaClient();

@Resolver(() => Task)
export class TaskResolver {
  @Query(() => [Task])
  async tasks() {
    return prisma.task.findMany();
  }

  @Query(() => Task, { nullable: true })
  async task(@Arg("id", () => ID) id: number) {
    return prisma.task.findUnique({ where: { id } });
  }

  @Mutation(() => Task)
  async createTask(@Arg("data") data: CreateTaskInput) {
    return prisma.task.create({ data });
  }

  @Mutation(() => Task, { nullable: true })
  async updateTask(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateTaskInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateTaskInput;
    return prisma.task.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg("id", () => ID) id: number) {
    await prisma.task.delete({ where: { id } });
    return true;
  }
}
