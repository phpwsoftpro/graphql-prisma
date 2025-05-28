import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Project } from "../schema/Project";
import { CreateProjectInput, UpdateProjectInput } from "../schema/ProjectInput";

const prisma = new PrismaClient();

@Resolver(() => Project)
export class ProjectResolver {
  @Query(() => [Project])
  async projects() {
    return prisma.project.findMany();
  }

  @Query(() => Project, { nullable: true })
  async project(@Arg("id", () => ID) id: number) {
    return prisma.project.findUnique({ where: { id } });
  }

  @Mutation(() => Project)
  async createProject(@Arg("data") data: CreateProjectInput) {
    return prisma.project.create({ data });
  }

  @Mutation(() => Project, { nullable: true })
  async updateProject(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateProjectInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateProjectInput;
    return prisma.project.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteProject(@Arg("id", () => ID) id: number) {
    await prisma.project.delete({ where: { id } });
    return true;
  }
}
