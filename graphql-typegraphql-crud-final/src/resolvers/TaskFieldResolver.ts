import { Resolver, FieldResolver, Root } from "type-graphql";
import { Task } from "../schema/Task";
import { CommentListResponse } from "../schema/CommentListResponse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver(() => Task)
export class TaskFieldResolver {
  @FieldResolver(() => CommentListResponse, { nullable: true })
  async comments(@Root() task: Task): Promise<CommentListResponse> {
    const totalCount = await prisma.comment.count({ where: { taskId: task.id } });
    // Nếu muốn lấy nodes luôn:
    // const nodes = await prisma.comment.findMany({ where: { taskId: task.id } });
    // return { nodes, totalCount };
    return { nodes: [], totalCount };
  }
} 