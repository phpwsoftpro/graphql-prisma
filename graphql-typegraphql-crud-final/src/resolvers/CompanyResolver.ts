import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Company } from "../schema/Company";
import { CreateCompanyInput, UpdateCompanyInput } from "../schema/CompanyInput";

const prisma = new PrismaClient();

@Resolver(() => Company)
export class CompanyResolver {
  @Query(() => [Company])
  async companies() {
    return prisma.company.findMany();
  }

  @Query(() => Company, { nullable: true })
  async company(@Arg("id", () => ID) id: number) {
    return prisma.company.findUnique({ where: { id } });
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
