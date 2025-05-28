import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TaskStage } from "../schema/TaskStage";
import { CreateTaskStageInput, UpdateTaskStageInput } from "../schema/TaskStageInput";

const prisma = new PrismaClient();

@Resolver(() => TaskStage)
export class TaskStageResolver {
  @Query(() => [TaskStage])
  async taskStages() {
    return prisma.taskStage.findMany();
  }

  @Query(() => TaskStage, { nullable: true })
  async taskStage(@Arg("id", () => ID) id: number) {
    return prisma.taskStage.findUnique({ where: { id } });
  }

  @Mutation(() => TaskStage)
  async createTaskStage(@Arg("data") data: CreateTaskStageInput) {
    return prisma.taskStage.create({ data });
  }

  @Mutation(() => TaskStage, { nullable: true })
  async updateTaskStage(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateTaskStageInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateTaskStageInput;
    return prisma.taskStage.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteTaskStage(@Arg("id", () => ID) id: number) {
    await prisma.taskStage.delete({ where: { id } });
    return true;
  }
}
