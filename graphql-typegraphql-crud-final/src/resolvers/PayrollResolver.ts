import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Payroll } from "../schema/Payroll";
import { CreatePayrollInput, UpdatePayrollInput } from "../schema/PayrollInput";

const prisma = new PrismaClient();

@Resolver(() => Payroll)
export class PayrollResolver {
  @Query(() => [Payroll])
  async payrolls() {
    return prisma.payroll.findMany();
  }

  @Query(() => Payroll, { nullable: true })
  async payroll(@Arg("id", () => ID) id: string) {
    return prisma.payroll.findUnique({ where: { id } });
  }

  @Mutation(() => Payroll)
  async createPayroll(@Arg("data") data: CreatePayrollInput) {
    return prisma.payroll.create({ data });
  }

  @Mutation(() => Payroll, { nullable: true })
  async updatePayroll(
    @Arg("id", () => ID) id: string,
    @Arg("data") data: UpdatePayrollInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdatePayrollInput;
    return prisma.payroll.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deletePayroll(@Arg("id", () => ID) id: string) {
    await prisma.payroll.delete({ where: { id } });
    return true;
  }
}
