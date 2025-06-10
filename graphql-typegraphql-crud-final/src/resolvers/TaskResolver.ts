import { Resolver, Query, Arg, Mutation, ID } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TaskConnection } from "../schema/TaskConnection";
import { TaskFilter } from "../schema/TaskFilter";
import { TaskSort } from "../schema/TaskSort";
import { OffsetPaging } from "../schema/PagingInput";
import { CreateTaskInput, TaskInput, UpdateTaskInput } from "../schema/TaskInput";
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
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { nodes: nodes as Task[], totalCount };
  }

  @Mutation(() => Task)
  async createTask(@Arg("input") input: CreateTaskInput) {
    //nếu userIds rỗng thì bỏ ra khỏi input
    if (input.task.userIds?.length === 0) {
      delete input.task.userIds;
    }
    return prisma.task.create({ data: input.task });
  }
  // like update deal 
  @Mutation(() => Task, { nullable: true })
  async updateTask(@Arg("input") input: UpdateTaskInput) {
    // like update deal 
    const { stageId, ...rest } = input.update;
    
    const data: any = {
      ...rest,
    };
  
    if (stageId !== undefined) {
      data.stage = { connect: { id: Number(stageId) } };
    }
    return prisma.task.update({
      where: { id: Number(input.id) },
      data,
      include: {
        stage: true,
      },
    });
  }

  @Query(() => Task, { nullable: true })
  async task(@Arg("id", () => ID) id: string) {
    return prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        stage: true,
      },
    });
  }
}
