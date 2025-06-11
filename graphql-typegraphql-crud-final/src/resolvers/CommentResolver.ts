import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Comment } from "../schema/Comment";
import { TaskCommentsResponse } from "../schema/TaskCommentsResponse";
import { CreateCommentInput, UpdateCommentInput, CommentFilter, CommentSort, DeleteCommentInput } from "../schema/CommentInput";
import { CommentListResponse } from "../schema/CommentListResponse";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => Comment)
export class CommentResolver {
  @Query(() => CommentListResponse)
  async comments(
    @Arg("filter", () => CommentFilter, { nullable: true }) filter: CommentFilter,
    @Arg("sorting", () => [CommentSort], { nullable: true }) sorting: CommentSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<CommentListResponse> {
    const where: any = {};
    if (filter?.id) {
      where.id = filter.id;
    }
    if (filter?.comment) {
      if (typeof filter.comment === 'string') {
        if ((filter.comment as string).trim() !== '' && filter.comment !== '%%') {
          where.comment = { contains: filter.comment as string };
        }
      } else if (typeof filter.comment.iLike === 'string' && filter.comment.iLike !== '%%' && filter.comment.iLike.trim() !== '') {
        where.comment = { contains: filter.comment.iLike, mode: 'insensitive' };
      } else if (typeof filter.comment.contains === 'string' && filter.comment.contains.trim() !== '' && filter.comment.contains !== '%%') {
        where.comment = { contains: filter.comment.contains };
      } else if (typeof filter.comment.eq === 'string' && filter.comment.eq.trim() !== '' && filter.comment.eq !== '%%') {
        where.comment = filter.comment.eq;
      }
    }
    if (filter?.task?.id?.eq) {
      where.taskId = filter.task.id.eq;
    }
    if (filter?.createdById) {
      where.createdById = filter.createdById;
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { createdBy: true },
      }),
      prisma.comment.count({ where }),
    ]);
    return { nodes: nodes as Comment[], totalCount };
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
  async createComment(@Arg("input") input: CreateCommentInput) {
    return prisma.comment.create({
      data: {
        comment: input.comment.comment,
        task: { connect: { id: Number(input.comment.taskId) } },
        createdBy: { connect: { id: 1 } },
      },
      include: {
        createdBy: true,
        task: true,
      },
    });
  }

  @Mutation(() => Comment, { nullable: true })
  async updateComment(
    @Arg("input") input: UpdateCommentInput
  ) {
    return prisma.comment.update({
      where: { id: Number(input.id) },
      data: {
        comment: input.update.comment,
      }
    });
  }

  @Mutation(() => Boolean)
  async deleteComment(@Arg("input", () => DeleteCommentInput) input: DeleteCommentInput) {
    await prisma.comment.delete({ where: { id: Number(input.id) } });
    return true;
  }
}
