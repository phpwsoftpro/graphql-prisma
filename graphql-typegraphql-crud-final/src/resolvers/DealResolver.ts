import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Deal } from "../schema/Deal";
import { CreateDealInput, UpdateDealInput } from "../schema/DealInput";
import { DealDetail, CompanyWithContacts } from "../schema/DealDetail";
import { DealFilter } from "../schema/DealFilter";
import { DealSort } from "../schema/DealSort";
import { OffsetPaging } from "../schema/PagingInput";
import { DealConnection } from "../schema/DealConnection";
import { DealGroupByMonth } from "../schema/DealGroupByMonth";

const prisma = new PrismaClient();

@Resolver(() => Deal)
export class DealResolver {
  @Query(() => DealConnection)
  async deals(
    @Arg("filter", () => DealFilter, { nullable: true }) filter: DealFilter,
    @Arg("sorting", () => [DealSort], { nullable: true }) sorting: DealSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<DealConnection> {
    const where: any = {};
    if (filter?.title) where.title = { contains: filter.title };
    if (filter?.stageId) where.stageId = filter.stageId;
    // Thêm các filter khác nếu cần
    if (filter?.createdAt) {
      where.createdAt = {};
      if (filter.createdAt.gte) where.createdAt.gte = filter.createdAt.gte;
      if (filter.createdAt.lte) where.createdAt.lte = filter.createdAt.lte;
      if (filter.createdAt.eq) where.createdAt.equals = filter.createdAt.eq;
    }
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    const orderBy = sorting?.map((s) => ({
      [s.field]: (typeof s.direction === "string" && s.direction.toString() === "ASC") ? "asc" : "desc",
    })) ?? [];
    const [nodes, totalCount] = await prisma.$transaction([
      prisma.deal.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          company: true,
          dealOwner: true,
        },
      }),
      prisma.deal.count({ where }),
    ]);

    return { nodes: nodes as any, totalCount };
  }

  @Query(() => Deal, { nullable: true })
  async deal(@Arg("id", () => ID) id: number) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        dealOwner: true,
      },
    });
  }

  @Query(() => DealDetail, { nullable: true })
  async dealDetail(@Arg("id", () => ID) id: number) {
    const result = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            contacts: true,
          },
        },
        dealContact: {
          select: { id: true },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      title: result.title,
      stageId: result.stageId ?? undefined,
      value: result.amount,
      dealOwnerId: result.dealOwnerId ?? undefined,
      company: result.companyId && result.company
        ? { id: result.companyId, contacts: result.company.contacts }
        : null,
      dealContact: result.dealContactId ? { id: result.dealContactId } : null,
    } as DealDetail;
  }
  //map id to number
  @Mutation(() => Deal)
  async createDeal(@Arg("input") input: CreateDealInput) {
    const { dealContactId, dealOwnerId,companyId,stageId, ...rest } = input.deal;
    return prisma.deal.create({
      data: {
        title: rest.title ?? "",
        amount: rest.amount ?? 0,
        description: rest.description ?? "",
        dealContactId: Number(dealContactId),
        dealOwnerId: Number(dealOwnerId),
        companyId: Number(companyId),
        stageId: Number(stageId),
      },
      include: {
        company: true,
        dealOwner: true,
      },
    });
  }

  @Mutation(() => Deal, { nullable: true })
  async updateDeal(
    @Arg("input") input: UpdateDealInput
  ) {
    // Tách các trường   quan hệ ra khỏi updateData
    const { stageId, companyId, dealContactId, dealOwnerId, ...rest } = input.update;
  
    // Xây dựng object data cho Prisma
    const data: any = {
      ...rest,
    };
  
    if (stageId !== undefined) {
      data.stage = { connect: { id: Number(stageId) } };
    }
    if (companyId !== undefined) {
      data.company = { connect: { id: Number(companyId) } };
    }
    if (dealContactId !== undefined) {
      data.dealContact = { connect: { id: Number(dealContactId) } };
    }
    if (dealOwnerId !== undefined) {
      data.dealOwner = { connect: { id: Number(dealOwnerId) } };
    }
  
    return prisma.deal.update({
      where: { id: Number(input.id) },
      data,
      include: {
        company: true,
        dealOwner: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteDeal(@Arg("id", () => ID) id: number) {
    await prisma.deal.delete({ where: { id } });
    return true;
  }

  @Query(() => [DealGroupByMonth])
  async groupByDealByMonth(
    @Arg("filter", () => DealFilter, { nullable: true }) filter: DealFilter
  ): Promise<DealGroupByMonth[]> {
    // Lấy tất cả deal theo filter (nếu có)
    const deals = await prisma.deal.findMany({
      where: filter as any,
      include: { stage: true },
    });
    // Group theo stage, month, year
    const summaryMap = new Map<string, DealGroupByMonth>();
    for (const deal of deals) {
      const date = deal.updatedAt;
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const stage = deal.stage?.title ?? "UNKNOWN";
      const key = `${stage}-${year}-${month}`;
      const current = summaryMap.get(key) || {
        stage,
        month,
        year,
        totalValue: 0,
      };
      current.totalValue += deal.amount;
      summaryMap.set(key, current);
    }
    return Array.from(summaryMap.values());
  }
}
