import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Comment } from "../schema/Comment";
import { TaskCommentsResponse } from "../schema/TaskCommentsResponse";
import { CreateCommentInput, UpdateCommentInput } from "../schema/CommentInput";

const prisma = new PrismaClient();

@Resolver(() => Comment)
export class CommentResolver {
  @Query(() => [Comment])
  async comments() {
    return prisma.comment.findMany();
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
