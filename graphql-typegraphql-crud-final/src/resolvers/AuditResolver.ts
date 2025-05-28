import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Audit } from "../schema/Audit";
import { CreateAuditInput, UpdateAuditInput } from "../schema/AuditInput";

const prisma = new PrismaClient();

@Resolver(() => Audit)
export class AuditResolver {
  @Query(() => [Audit])
  async audits() {
    return prisma.audit.findMany();
  }

  @Query(() => Audit, { nullable: true })
  async audit(@Arg("id", () => ID) id: number) {
    return prisma.audit.findUnique({ where: { id } });
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
}
