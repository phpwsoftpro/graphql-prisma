import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Product } from "../schema/Product";
import { CreateProductInput, UpdateProductInput } from "../schema/ProductInput";

const prisma = new PrismaClient();

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  async products() {
    return prisma.product.findMany();
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg("id", () => ID) id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: CreateProductInput) {
    const createData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
    return prisma.product.create({ data: createData as any });
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateProductInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
    return prisma.product.update({ where: { id }, data: updateData as any });
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => ID) id: number) {
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
