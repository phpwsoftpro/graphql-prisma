import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Product } from "../schema/Product";
import { CreateProductInput, UpdateProductInput } from "../schema/ProductInput";
import { ProductFilter } from "../schema/ProductFilter";
import { ProductSort } from "../schema/ProductSort";
import { OffsetPaging } from "../schema/PagingInput";
import { ProductListResponse } from "../schema/ProductListResponse";

const prisma = new PrismaClient();

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => ProductListResponse)
  async products(
    @Arg("filter", () => ProductFilter, { nullable: true }) filter: ProductFilter,
    @Arg("sorting", () => [ProductSort], { nullable: true }) sorting: ProductSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<ProductListResponse> {
    const where: any = {};
    if (filter?.title) {
      if (typeof filter.title === "string" && filter.title.trim() !== "") {
        where.title = { contains: filter.title };
      } else if (typeof filter.title.contains === "string" && filter.title.contains.trim() !== "") {
        where.title = { contains: filter.title.contains };
      } else if (typeof filter.title.iLike === "string" && filter.title.iLike.trim() !== "") {
        where.title = { contains: filter.title.iLike, mode: "insensitive" };
      } else if (typeof filter.title.eq === "string" && filter.title.eq.trim() !== "") {
        where.title = filter.title.eq;
      }
    }
    if (filter?.status) {
      if (typeof filter.status === "string" && filter.status.trim() !== "") {
        where.status = { contains: filter.status };
      } else if (typeof filter.status.contains === "string" && filter.status.contains.trim() !== "") {
        where.status = { contains: filter.status.contains };
      } else if (typeof filter.status.iLike === "string" && filter.status.iLike.trim() !== "") {
        where.status = { contains: filter.status.iLike, mode: "insensitive" };
      } else if (typeof filter.status.eq === "string" && filter.status.eq.trim() !== "") {
        where.status = filter.status.eq;
      }
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy, skip, take }),
      prisma.product.count({ where }),
    ]);

    return { nodes, totalCount };
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg("id", () => ID) id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: CreateProductInput) {
    return prisma.product.create({ data });
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateProductInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateProductInput;
    return prisma.product.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => ID) id: number) {
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
