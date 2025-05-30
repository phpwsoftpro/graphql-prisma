import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Company } from "../schema/Company";
import { CompanyListResponse } from "../schema/CompanyListResponse";
import { OffsetPaging } from "../schema/PagingInput";
import { CompanyFilter } from "../schema/CompanyFilter";
import { CompanySort } from "../schema/CompanySort";
import { CreateCompanyInput, UpdateCompanyInput } from "../schema/CompanyInput";

const prisma = new PrismaClient();

@Resolver(() => Company)
export class CompanyResolver {

  @Query(() => CompanyListResponse)
  async companies(
    @Arg("filter", () => CompanyFilter, { nullable: true }) filter: CompanyFilter,
    @Arg("sorting", () => [CompanySort], { nullable: true }) sorting: CompanySort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<CompanyListResponse> {
    const where: any = {};
    if (filter?.name) {
      where.name = { contains: filter.name };
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction }));

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
        const sum = await prisma.deal.aggregate({
          where: { companyId: company.id },
          _sum: { amount: true },
        });
        return {
          ...company,
          dealsAggregate: [
            { sum: { value: sum._sum.amount ?? 0 } },
          ],
        } as any;
      })
    );

    return { nodes: nodesWithAggregate as any, totalCount };

  }

  @Query(() => Company, { nullable: true })
  async company(@Arg("id", () => ID) id: number) {
    return prisma.company.findUnique({
      where: { id },
      include: { contacts: true, salesOwner: true },
    });
  }

  @Mutation(() => Company)
  async createCompany(@Arg("data") data: CreateCompanyInput) {
    return prisma.company.create({ data });
  }

  @Mutation(() => Company, { nullable: true })
  async updateCompany(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateCompanyInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateCompanyInput;
    return prisma.company.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteCompany(@Arg("id", () => ID) id: number) {
    await prisma.company.delete({ where: { id } });
    return true;
  }
}
