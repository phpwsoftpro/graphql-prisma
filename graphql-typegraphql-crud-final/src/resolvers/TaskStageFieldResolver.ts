import { Resolver, FieldResolver, Root } from "type-graphql";
import { TaskStage } from "../schema/TaskStage";
import { Task } from "../schema/Task";
import { TaskStageTasksAggregateResponse, TaskStageTasksCountAggregate } from "../schema/TaskAggregate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver(() => TaskStage)
export class TaskStageFieldResolver {
  @FieldResolver(() => [TaskStageTasksAggregateResponse], { nullable: true })
  async tasksAggregate(@Root() stage: TaskStage): Promise<TaskStageTasksAggregateResponse[]> {
    const taskCount = await prisma.task.count({
      where: { stageId: stage.id }
    });

    return [{
      count: {
        id: taskCount
      }
    }];
  }

  @FieldResolver(() => [Task], { nullable: true })
  async tasks(@Root() stage: TaskStage) {
    return prisma.task.findMany({
      where: { stageId: stage.id }
    });
  }
}
