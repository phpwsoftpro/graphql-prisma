import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Comment } from "../schema/Comment";
import { TaskCommentsResponse } from "../schema/TaskCommentsResponse";
import { CreateCommentInput, UpdateCommentInput } from "../schema/CommentInput";
import { CommentConnection } from "../schema/CommentConnection";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => Comment)
export class CommentResolver {
  @Query(() => CommentConnection)
  async comments(
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<CommentConnection> {
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    const [nodes, totalCount] = await prisma.$transaction([
      prisma.comment.findMany({
        skip,
        take,
      }),
      prisma.comment.count(),
    ]);
    return { nodes, totalCount };
  }

  @Query(() => Comment, { nullable: true })
  async comment(@Arg("id", () => ID) id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  @Query(() => TaskCommentsResponse)
  async commentsByTask(@Arg("taskId", () => ID) taskId: number) {
    const [comments, totalCount] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { taskId },
        include: { createdBy: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.comment.count({ where: { taskId } }),
    ]);

    return { comments, totalCount };
  }

  @Mutation(() => Comment)
  async createComment(@Arg("data") data: CreateCommentInput) {
    return prisma.comment.create({ data });
  }

  @Mutation(() => Comment, { nullable: true })
  async updateComment(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateCommentInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateCommentInput;
    return prisma.comment.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteComment(@Arg("id", () => ID) id: number) {
    await prisma.comment.delete({ where: { id } });
    return true;
  }
}
