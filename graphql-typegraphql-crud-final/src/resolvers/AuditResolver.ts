import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Audit } from "../schema/Audit";
import { CreateAuditInput, UpdateAuditInput } from "../schema/AuditInput";
import { AuditConnection } from "../schema/AuditConnection";
import { AuditFilter } from "../schema/AuditFilter";
import { AuditSort } from "../schema/AuditSort";
import { OffsetPaging } from "../schema/PagingInput";
import { FieldResolver, Root } from "type-graphql";
import { Changes } from "../schema/Changes";

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
    if (filter?.user) {
      where.user = {};
      if (filter.user.name) {
        if (typeof filter.user.name === 'string') {
          if ((filter.user.name as string).trim() !== '' && filter.user.name !== '%%') {
            where.user.name = { contains: filter.user.name as string };
          }
        } else if (typeof filter.user.name.iLike === 'string' && filter.user.name.iLike !== '%%' && filter.user.name.iLike.trim() !== '') {
          where.user.name = { contains: filter.user.name.iLike, mode: 'insensitive' };
        } else if (typeof filter.user.name.contains === 'string' && filter.user.name.contains.trim() !== '' && filter.user.name.contains !== '%%') {
          where.user.name = { contains: filter.user.name.contains };
        } else if (typeof filter.user.name.eq === 'string' && filter.user.name.eq.trim() !== '' && filter.user.name.eq !== '%%') {
          where.user.name = filter.user.name.eq;
        } else if (typeof filter.user.name.equals === 'string' && filter.user.name.equals.trim() !== '' && filter.user.name.equals !== '%%') {
          where.user.name = filter.user.name.equals;
        }
      }
      if (filter.user.email) {
        if (typeof filter.user.email === 'string') {
          if ((filter.user.email as string).trim() !== '' && filter.user.email !== '%%') {
            where.user.email = { contains: filter.user.email as string };
          }
        } else if (typeof filter.user.email.iLike === 'string' && filter.user.email.iLike !== '%%' && filter.user.email.iLike.trim() !== '') {
          where.user.email = { contains: filter.user.email.iLike, mode: 'insensitive' };
        } else if (typeof filter.user.email.contains === 'string' && filter.user.email.contains.trim() !== '' && filter.user.email.contains !== '%%') {
          where.user.email = { contains: filter.user.email.contains };
        } else if (typeof filter.user.email.eq === 'string' && filter.user.email.eq.trim() !== '' && filter.user.email.eq !== '%%') {
          where.user.email = filter.user.email.eq;
        } else if (typeof filter.user.email.equals === 'string' && filter.user.email.equals.trim() !== '' && filter.user.email.equals !== '%%') {
          where.user.email = filter.user.email.equals;
        }
      }
      if (filter.user.role) {
        if (typeof filter.user.role === 'string') {
          if ((filter.user.role as string).trim() !== '' && filter.user.role !== '%%') {
            where.user.role = { contains: filter.user.role as string };
          }
        } else if (typeof filter.user.role.iLike === 'string' && filter.user.role.iLike !== '%%' && filter.user.role.iLike.trim() !== '') {
          where.user.role = { contains: filter.user.role.iLike, mode: 'insensitive' };
        } else if (typeof filter.user.role.contains === 'string' && filter.user.role.contains.trim() !== '' && filter.user.role.contains !== '%%') {
          where.user.role = { contains: filter.user.role.contains };
        } else if (typeof filter.user.role.eq === 'string' && filter.user.role.eq.trim() !== '' && filter.user.role.eq !== '%%') {
          where.user.role = filter.user.role.eq;
        } else if (typeof filter.user.role.equals === 'string' && filter.user.role.equals.trim() !== '' && filter.user.role.equals !== '%%') {
          where.user.role = filter.user.role.equals;
        }
      }
      if (filter.user.status) {
        if (typeof filter.user.status === 'string') {
          if ((filter.user.status as string).trim() !== '' && filter.user.status !== '%%') {
            where.user.status = { contains: filter.user.status as string };
          }
        } else if (typeof filter.user.status.iLike === 'string' && filter.user.status.iLike !== '%%' && filter.user.status.iLike.trim() !== '') {
          where.user.status = { contains: filter.user.status.iLike, mode: 'insensitive' };
        } else if (typeof filter.user.status.contains === 'string' && filter.user.status.contains.trim() !== '' && filter.user.status.contains !== '%%') {
          where.user.status = { contains: filter.user.status.contains };
        } else if (typeof filter.user.status.eq === 'string' && filter.user.status.eq.trim() !== '' && filter.user.status.eq !== '%%') {
          where.user.status = filter.user.status.eq;
        } else if (typeof filter.user.status.equals === 'string' && filter.user.status.equals.trim() !== '' && filter.user.status.equals !== '%%') {
          where.user.status = filter.user.status.equals;
        }
      }
      if (filter.user.jobTitle) {
        if (typeof filter.user.jobTitle === 'string') {
          if ((filter.user.jobTitle as string).trim() !== '' && filter.user.jobTitle !== '%%') {
            where.user.jobTitle = { contains: filter.user.jobTitle as string };
          }
        } else if (typeof filter.user.jobTitle.iLike === 'string' && filter.user.jobTitle.iLike !== '%%' && filter.user.jobTitle.iLike.trim() !== '') {
          where.user.jobTitle = { contains: filter.user.jobTitle.iLike, mode: 'insensitive' };
        } else if (typeof filter.user.jobTitle.contains === 'string' && filter.user.jobTitle.contains.trim() !== '' && filter.user.jobTitle.contains !== '%%') {
          where.user.jobTitle = { contains: filter.user.jobTitle.contains };
        } else if (typeof filter.user.jobTitle.eq === 'string' && filter.user.jobTitle.eq.trim() !== '' && filter.user.jobTitle.eq !== '%%') {
          where.user.jobTitle = filter.user.jobTitle.eq;
        } else if (typeof filter.user.jobTitle.equals === 'string' && filter.user.jobTitle.equals.trim() !== '' && filter.user.jobTitle.equals !== '%%') {
          where.user.jobTitle = filter.user.jobTitle.equals;
        }
      }
    }
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

    // Để FieldResolver xử lý changes, không trả về trực tiếp
    const mappedNodes = nodes.map(audit => ({
      ...audit,
      changes: [],
      userId: audit.userId === null ? undefined : audit.userId,
      
    }));

    return { nodes: mappedNodes, totalCount };
  }

  @FieldResolver(() => [Changes])
  changes(@Root() audit: Audit): Changes[] {
    if (!audit.changes) return [];
    if (typeof audit.changes === "string") {
      try {
        const arr = JSON.parse(audit.changes);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    if (Array.isArray(audit.changes)) return audit.changes;
    return [];
  }
}
