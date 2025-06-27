import { Arg, ID, Mutation, Query, Resolver, UseMiddleware, Ctx } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Company } from "../schema/Company";
import { CompanyListResponse } from "../schema/CompanyListResponse";
import { OffsetPaging } from "../schema/PagingInput";
import { CompanyFilter } from "../schema/CompanyFilter";
import { CompanySort } from "../schema/CompanySort";
import { UpdateCompanyInputWrapper, DeleteCompanyInput, CreateOneCompanyInput } from "../schema/CompanyInput";
import { typeGraphqlAuth } from "../common/middleware/auth.middleware";
import { PermissionService } from "../common/services/permission.service";
import { UserRole } from "../enums/UserRole";

const prisma = new PrismaClient();

@Resolver(() => Company)
export class CompanyResolver {

  @Query(() => CompanyListResponse)
  @UseMiddleware(typeGraphqlAuth)
  async companies(
    @Arg("filter", () => CompanyFilter, { nullable: true }) filter: CompanyFilter,
    @Arg("sorting", () => [CompanySort], { nullable: true }) sorting: CompanySort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging,
    @Ctx() context?: any
  ): Promise<CompanyListResponse> {
    const user = context.user;
    const userRole = user?.role as UserRole;
    
    // Kiểm tra quyền đọc
    if (!PermissionService.canRead(userRole)) {
      throw new Error("Access denied: Insufficient permissions to read data");
    }

    const where: any = {};
    if (filter?.name) {
      if (typeof filter.name === 'string') {
        if ((filter.name as string).trim() !== '') {
          where.name = { contains: filter.name };
        }
      } else if (typeof filter.name.iLike === 'string' && filter.name.iLike !== '%%' && filter.name.iLike.trim() !== '') {
        where.name = { contains: filter.name.iLike, mode: 'insensitive' };
      } else if (typeof filter.name.contains === 'string' && filter.name.contains.trim() !== '') {
        where.name = { contains: filter.name.contains };
      } else if (typeof filter.name.eq === 'string' && filter.name.eq.trim() !== '') {
        where.name = filter.name.eq;
      }
    }

    if (filter?.salesOwner?.id?.eq) {
      where.salesOwnerId = Number(filter.salesOwner.id.eq);
    }

    if (filter?.country) {
      if (typeof filter.country === 'string') {
        if ((filter.country as string).trim() !== '') {
          where.country = { contains: filter.country };
        }
      } else if (typeof filter.country.iLike === 'string' && filter.country.iLike !== '%%' && filter.country.iLike.trim() !== '') {
        where.country = { contains: filter.country.iLike, mode: 'insensitive' };
      } else if (typeof filter.country.contains === 'string' && filter.country.contains.trim() !== '') {
        where.country = { contains: filter.country.contains };
      } else if (typeof filter.country.eq === 'string' && filter.country.eq.trim() !== '') {
        where.country = filter.country.eq;
      }
    }

    if (filter?.website) {
      if (typeof filter.website === 'string') {
        if ((filter.website as string).trim() !== '') {
          where.website = { contains: filter.website };
        }
      } else if (typeof filter.website.iLike === 'string' && filter.website.iLike !== '%%' && filter.website.iLike.trim() !== '') {
        where.website = { contains: filter.website.iLike, mode: 'insensitive' };
      } else if (typeof filter.website.contains === 'string' && filter.website.contains.trim() !== '') {
        where.website = { contains: filter.website.contains };
      } else if (typeof filter.website.eq === 'string' && filter.website.eq.trim() !== '') {
        where.website = filter.website.eq;
      }
    }

    if (filter?.totalRevenue?.eq) {
      where.totalRevenue = filter.totalRevenue.eq;
    }

    if (filter?.id?.eq) {
      where.id = Number(filter.id.eq);
    }

    if (filter?.createdAt?.eq) {
      where.createdAt = filter.createdAt.eq;
    }

    if (filter?.updatedAt?.eq) {
      where.updatedAt = filter.updatedAt.eq;
    }

    if (filter?.businessType?.eq) {
      where.businessType = filter.businessType.eq;
    }

    if (filter?.companySize?.eq) {
      where.companySize = filter.companySize.eq;
    }

    if (filter?.industry?.eq) {
      where.industry = filter.industry.eq;
    }

    if (filter?.contacts?.id?.in && Array.isArray(filter.contacts.id.in)) {
      where.contacts = {
        some: {
          id: {
            in: filter.contacts.id.in.map((id: string) => Number(id)),
          },
        },
      };
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.company.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          salesOwner: true,
          contacts: true,
        },
      }),
      prisma.company.count({ where }),
    ]);

    const nodesWithAggregate = await Promise.all(
      nodes.map(async (company) => {
        const [sum, contacts] = await Promise.all([
          prisma.deal.aggregate({
            where: { companyId: company.id },
            _sum: { amount: true },
          }),
          prisma.contact.findMany({
            where: { companyId: company.id },
            include: { salesOwner: true },
          }),
        ]);

        return {
          ...company,
          dealsAggregate: [
            { sum: { value: sum._sum.amount ?? 0 } },
          ],
          contacts: {
            nodes: contacts,
            totalCount: contacts.length,
          },
        } as any;
      })
    );

    return { nodes: nodesWithAggregate as any, totalCount };
  }

  @Query(() => Company, { nullable: true })
  @UseMiddleware(typeGraphqlAuth)
  async company(@Arg("id", () => ID) id: number, @Ctx() context?: any) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    
    // Kiểm tra quyền đọc
    if (!PermissionService.canRead(userRole)) {
      throw new Error("Access denied: Insufficient permissions to read data");
    }

    const company = await prisma.company.findUnique({
      where: { id: Number(id) },
      include: { contacts: true, salesOwner: true },
    });

    if (!company) return null;

    const [sum, contacts] = await Promise.all([
      prisma.deal.aggregate({
        where: { companyId: company.id },
        _sum: { amount: true },
      }),
      prisma.contact.findMany({
        where: { companyId: company.id },
        include: { salesOwner: true },
      }),
    ]);

    return {
      ...company,
      dealsAggregate: [
        { sum: { value: sum._sum.amount ?? 0 } },
      ],
      contacts: {
        nodes: contacts,
        totalCount: contacts.length,
      },
    } as any;
  }

  @Mutation(() => Company )
  @UseMiddleware(typeGraphqlAuth)
  async createOneCompany(@Arg("input", () => CreateOneCompanyInput) input: CreateOneCompanyInput, @Ctx() context?: any) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    
    // Kiểm tra quyền tạo mới
    if (!PermissionService.canCreate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to create data");
    }

    const { salesOwnerId, ...rest } = input.company;
    const company = await prisma.company.create({
      data: {
        ...rest,
        salesOwner: salesOwnerId ? { connect: { id: Number(salesOwnerId) } } : undefined,
      },
      include: {
        salesOwner: true,
        contacts: true,
      },
    });
    
    return company;
  }

  @Mutation(() => Company)
  @UseMiddleware(typeGraphqlAuth)
  async updateCompany(@Arg("input", () => UpdateCompanyInputWrapper) input: UpdateCompanyInputWrapper, @Ctx() context?: any) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    
    // Kiểm tra quyền cập nhật
    if (!PermissionService.canUpdate(userRole)) {
      throw new Error("Access denied: Insufficient permissions to update data");
    }

    // Kiểm tra company có tồn tại không
    const existingCompany = await prisma.company.findUnique({
      where: { id: Number(input.id) }
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    const { salesOwnerId, ...rest } = input.update;
    return prisma.company.update({
      where: { id: Number(input.id) },
      data: {
        ...rest,
        salesOwner: salesOwnerId ? { connect: { id: Number(salesOwnerId) } } : undefined,
      },
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(typeGraphqlAuth)
  async deleteCompany(@Arg("input", () => DeleteCompanyInput) input: DeleteCompanyInput, @Ctx() context?: any) {
    const user = context.user;
    const userRole = user?.role as UserRole;
    
    // Kiểm tra quyền xóa
    if (!PermissionService.canDelete(userRole)) {
      throw new Error("Access denied: Insufficient permissions to delete data");
    }

    // Kiểm tra company có tồn tại không
    const existingCompany = await prisma.company.findUnique({
      where: { id: Number(input.id) }
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    await prisma.company.delete({
      where: { id: Number(input.id) },
    });

    return true;
  }
}
