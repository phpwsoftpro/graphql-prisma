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
    @Arg("sorting", () => [ProductSort], { nullable: true }) sorting: ProductSort[] = [],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ): Promise<ProductListResponse> {
    const where: any = {};
    if (filter?.name) {
      if (typeof filter.name === 'string') {
        if ((filter.name as string).trim() !== '' && filter.name !== '%%') {
          where.name = { contains: filter.name as string };
        }
      } else if (
        typeof filter.name.iLike === 'string' &&
        filter.name.iLike !== '%%' &&
        filter.name.iLike.trim() !== ''
      ) {
        where.name = { contains: filter.name.iLike, mode: 'insensitive' };
      } else if (
        typeof filter.name.contains === 'string' &&
        filter.name.contains.trim() !== '' &&
        filter.name.contains !== '%%'
      ) {
        where.name = { contains: filter.name.contains };
      } else if (
        typeof filter.name.eq === 'string' &&
        filter.name.eq.trim() !== '' &&
        filter.name.eq !== '%%'
      ) {
        where.name = filter.name.eq;
      }
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: 'desc' }];
    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy, skip, take }),
      prisma.product.count({ where })
    ]);

    return { nodes, totalCount };
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg("id", () => ID) id: string) {
    return prisma.product.findUnique({ where: { id: Number(id) } });
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: CreateProductInput) {
    return prisma.product.create({ data });
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg("id", () => ID) id: string,
    @Arg("data") data: UpdateProductInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateProductInput;
      return prisma.product.update({ where: { id: Number(id) }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => ID) id: string) {
    await prisma.product.delete({ where: { id: Number(id) } });
    return true;
  }
}
