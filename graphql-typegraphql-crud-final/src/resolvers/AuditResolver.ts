import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Audit } from "../schema/Audit";
import { CreateAuditInput, UpdateAuditInput } from "../schema/AuditInput";
import { AuditConnection } from "../schema/AuditConnection";
import { AuditFilter } from "../schema/AuditFilter";
import { AuditSort } from "../schema/AuditSort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => Audit)
export class AuditResolver {
  

  @Query(() => Audit, { nullable: true })
  async audit(@Arg("id", () => ID) id: number) {
    return prisma.audit.findUnique({ where: { id }, include: { user: true } });
  }

  @Mutation(() => Audit)
  async createAudit(@Arg("data") data: CreateAuditInput) {
    return prisma.audit.create({ data });
  }

  @Mutation(() => Audit, { nullable: true })
  async updateAudit(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateAuditInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateAuditInput;
    return prisma.audit.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteAudit(@Arg("id", () => ID) id: number) {
    await prisma.audit.delete({ where: { id } });
    return true;
  }

  @Query(() => AuditConnection)
  async audits(
    @Arg("filter", () => AuditFilter, { nullable: true }) filter: AuditFilter,
    @Arg("sorting", () => [AuditSort], { nullable: true }) sorting: AuditSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<AuditConnection> {
    const where: any = {};
    if (filter?.action?.eq) where.action = filter.action.eq;
    if (filter?.action?.in) where.action = { in: filter.action.in };
    if (filter?.action?.contains) where.action = { contains: filter.action.contains };
    if (filter?.targetEntity?.eq) where.targetEntity = filter.targetEntity.eq;
    if (filter?.targetEntity?.in) where.targetEntity = { in: filter.targetEntity.in };
    if (filter?.targetEntity?.contains) where.targetEntity = { contains: filter.targetEntity.contains };
    // Thêm các filter khác nếu cần

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;
    const orderBy = sorting?.map((s) => ({
      [s.field]: s.direction.toLowerCase(),
    })) ?? [];

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.audit.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: true,
          
        },
      }),
      prisma.audit.count({ where }),
    ]);

    return { nodes, totalCount };
  }
}
