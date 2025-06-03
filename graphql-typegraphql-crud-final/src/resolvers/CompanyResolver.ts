import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Company } from "../schema/Company";
import { CompanyListResponse } from "../schema/CompanyListResponse";
import { OffsetPaging } from "../schema/PagingInput";
import { CompanyFilter } from "../schema/CompanyFilter";
import { CompanySort } from "../schema/CompanySort";
import { CompanyInput, CreateCompanyInput, UpdateCompanyInput } from "../schema/CompanyInput";

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
  async company(@Arg("id", () => ID) id: number) {
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

  @Mutation(() => Company)
  async createCompany(@Arg("input", () => CreateCompanyInput) input: CreateCompanyInput) {
    return prisma.company.create({ data: input.company });
  }

  @Mutation(() => Company, { nullable: true })
  async updateCompany(
    @Arg("input", () => UpdateCompanyInput) input: UpdateCompanyInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(input.update).filter(([, value]) => value !== undefined)
    ) as CompanyInput;
    return prisma.company.update({ where: { id: input.id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteCompany(@Arg("id", () => ID) id: number) {
    await prisma.company.delete({ where: { id } });
    return true;
  }
}
