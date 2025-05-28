import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Category } from "../schema/Category";
import { CreateCategoryInput, UpdateCategoryInput } from "../schema/CategoryInput";

const prisma = new PrismaClient();

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories() {
    return prisma.category.findMany();
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id", () => ID) id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data") data: CreateCategoryInput) {
    return prisma.category.create({ data });
  }

  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateCategoryInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateCategoryInput;
    return prisma.category.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id", () => ID) id: number) {
    await prisma.category.delete({ where: { id } });
    return true;
  }
}
