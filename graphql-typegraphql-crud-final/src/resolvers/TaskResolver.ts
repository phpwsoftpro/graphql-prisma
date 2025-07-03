import { Resolver, Query, Arg, Mutation, ID } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TaskConnection } from "../schema/TaskConnection";
import { TaskFilter } from "../schema/TaskFilter";
import { TaskSort } from "../schema/TaskSort";
import { OffsetPaging } from "../schema/PagingInput";
import { CreateTaskInput, DeleteTaskInput, TaskInput, UpdateTaskInput } from "../schema/TaskInput";
import { Task } from "../schema/Task";

const prisma = new PrismaClient();

@Resolver(() => Task)
export class TaskResolver {
  @Query(() => TaskConnection)
  async tasks(
    @Arg("filter", () => TaskFilter, { nullable: true }) filter: TaskFilter,
    @Arg("sorting", () => [TaskSort], { nullable: true }) sorting: TaskSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<TaskConnection> {
    const where: any = {};
    if (filter?.title?.eq) where.title = filter.title.eq;
    if (filter?.title?.in) where.title = { in: filter.title.in };
    if (filter?.stageId) where.stageId = filter.stageId;
    // Thêm các filter khác nếu cần

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    const orderBy = sorting?.map((s) => ({
      [s.field]: s.direction.toLowerCase(),
    })) ?? [];

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          stage: true,
          users: true,
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Chuyển checklist từ JSON sang ChecklistItem[] nếu cần
    const mappedNodes = nodes.map((node: any) => ({
      ...node,
      checklist: Array.isArray(node.checklist) ? node.checklist : [],
    }));

    return { nodes: mappedNodes, totalCount };
  }

  @Mutation(() => Task)
  async createTask(@Arg("input") input: CreateTaskInput) {
    // Nếu userIds rỗng thì bỏ ra khỏi input
    const { stageId, userIds, ...rest } = input.task;
    const data: any = { ...rest };
    if (stageId !== undefined && stageId !== null) {
      data.stage = { connect: { id: Number(stageId) } };
    }
    if (userIds !== undefined) {
      data.users = { connect: userIds.map((id: any) => ({ id: Number(id) })) };
    }
    return prisma.task.create({
      data,
      include: {
        stage: true,
        users: true,
      },
    });
  }
  // like update deal 
  @Mutation(() => Task, { nullable: true })
  async updateTask(@Arg("input") input: UpdateTaskInput) {
    // like update deal 
    const { stageId, userIds, ...rest } = input.update;
    const data: any = {
      ...rest,
    };
    if (stageId !== undefined && stageId !== null) {
      data.stage = { connect: { id: Number(stageId) } };
    }
    if (userIds !== undefined) {
      data.users = { set: userIds.map((id: any) => ({ id: Number(id) })) };
    }
    return prisma.task.update({
      where: { id: Number(input.id) },
      data,
      include: {
        stage: true,
        users: true,
      },
    });
  }

  @Query(() => Task, { nullable: true })
  async task(@Arg("id", () => ID) id: string) {
    return prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        stage: true,
        users: true,
      },
    });
  }
  //delete task
  @Mutation(() => Task)
  async deleteTask(@Arg("input") input: DeleteTaskInput) {
    return prisma.task.delete({
      where: { id: Number(input.id) },
    });
  }
}
