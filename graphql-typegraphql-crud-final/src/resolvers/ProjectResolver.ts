import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Project } from "../schema/Project";
import { CreateProjectInput, UpdateProjectInput ,DeleteProductInput} from "../schema/ProjectInput";
import { typeGraphqlAuth } from "../common/middleware/auth.middleware";

const prisma = new PrismaClient();

@Resolver(() => Project)
export class ProjectResolver {
  @Query(() => [Project])
  @UseMiddleware(typeGraphqlAuth)
  async projects() {
    return prisma.project.findMany();
  }

  @Query(() => Project, { nullable: true })
  @UseMiddleware(typeGraphqlAuth)
  async project(@Arg("id", () => ID) id: number) {
    return prisma.project.findUnique({ where: { id } });
  }

  @Mutation(() => Project)
  @UseMiddleware(typeGraphqlAuth)
  async createProject(@Arg("data") data: CreateProjectInput) {
    return prisma.project.create({ data });
  }

  @Mutation(() => Project, { nullable: true })
  @UseMiddleware(typeGraphqlAuth)
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
  @UseMiddleware(typeGraphqlAuth)
  async deleteProduct(
    @Arg("input", () => DeleteProductInput) input: DeleteProductInput
  ) {
    await prisma.product.delete({ where: { id: Number(input.id) } });
    return true;
  }
}
