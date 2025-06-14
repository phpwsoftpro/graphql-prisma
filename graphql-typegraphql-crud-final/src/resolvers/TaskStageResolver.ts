import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TaskStage, TaskStageConnection } from "../schema/TaskStage";
import { CreateTaskStageInput, DeleteTaskStageInput, UpdateTaskStageInput } from "../schema/TaskStageInput";
import { TaskStageFilter } from "../schema/TaskStageFilter";
import { TaskStageSort } from "../schema/TaskStageSort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => TaskStage)
export class TaskStageResolver {
  @Query(() => TaskStageConnection)
  async taskStages(
    @Arg("filter", () => TaskStageFilter, { nullable: true }) filter: TaskStageFilter,
    @Arg("sorting", () => [TaskStageSort], { nullable: true }) sorting: TaskStageSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<TaskStageConnection> {
    // Build Prisma where from filter
    const where: any = {};
    if (filter?.title?.eq) {
      where.title = filter.title.eq;
    } else {
      if (filter?.title?.in) {
        where.title = { in: filter.title.in };
      }
      if (filter?.title?.notIn) {
        where.title = { notIn: filter.title.notIn };
      }
    }
    // Build orderBy from sorting
    const orderBy = sorting?.map((s) => ({
      [s.field]: s.direction.toLowerCase(),
    })) ?? [];
    // Paging
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    // Query
    const [nodes, totalCount] = await prisma.$transaction([
      prisma.taskStage.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.taskStage.count({ where }),
    ]);
    return { nodes, totalCount };
  }

  @Query(() => TaskStage, { nullable: true })
  async taskStage(@Arg("id", () => ID) id: number) {
    return prisma.taskStage.findUnique({ where: { id } });
  }

  @Mutation(() => TaskStage)
  async createTaskStage(@Arg("input") input: CreateTaskStageInput) {
    return prisma.taskStage.create({ data: input.taskStage });
  }

  @Mutation(() => TaskStage, { nullable: true })
  async updateTaskStage(
    @Arg("input") input: UpdateTaskStageInput
    ) {
      return prisma.taskStage.update({
        where: { id: Number(input.id) },
        data: input.update,
      });
  }

  @Mutation(() => TaskStage)
  async deleteTaskStage(@Arg("input") input: DeleteTaskStageInput) {
    return prisma.taskStage.delete({ where: { id: Number(input.id) } });
  }
}
