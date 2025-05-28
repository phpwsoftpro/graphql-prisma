import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Checklist } from "../schema/Checklist";
import { CreateChecklistInput, UpdateChecklistInput } from "../schema/ChecklistInput";

const prisma = new PrismaClient();

@Resolver(() => Checklist)
export class ChecklistResolver {
  @Query(() => [Checklist])
  async checklists() {
    return prisma.checklist.findMany();
  }

  @Query(() => Checklist, { nullable: true })
  async checklist(@Arg("id", () => ID) id: number) {
    return prisma.checklist.findUnique({ where: { id } });
  }

  @Mutation(() => Checklist)
  async createChecklist(@Arg("data") data: CreateChecklistInput) {
    return prisma.checklist.create({ data });
  }

  @Mutation(() => Checklist, { nullable: true })
  async updateChecklist(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateChecklistInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateChecklistInput;

    return prisma.checklist.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteChecklist(@Arg("id", () => ID) id: number) {
    await prisma.checklist.delete({ where: { id } });
    return true;
  }
}
