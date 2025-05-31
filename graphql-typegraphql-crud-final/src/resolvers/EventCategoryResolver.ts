import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { EventCategory } from "../schema/EventCategory";
import { EventCategoryListResponse } from "../schema/EventCategoryListResponse";
import { EventCategoryFilter } from "../schema/EventCategoryFilter";
import { EventCategorySort } from "../schema/EventCategorySort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => EventCategory)
export class EventCategoryResolver {
  @Query(() => EventCategoryListResponse)
  async eventCategories(
    @Arg("filter", () => EventCategoryFilter, { nullable: true }) filter: EventCategoryFilter,
    @Arg("sorting", () => [EventCategorySort], { nullable: true }) sorting: EventCategorySort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
    const where: any = {};
    if (filter?.title) {
      where.title = { contains: filter.title };
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ id: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.eventCategory.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.eventCategory.count({ where }),
    ]);

    return { nodes, totalCount };
  }

  @Query(() => EventCategory, { nullable: true })
  async eventCategory(@Arg("id", () => ID) id: number) {
    return prisma.eventCategory.findUnique({
      where: { id },
    });
  }

  @Mutation(() => EventCategory)
  async createEventCategory(@Arg("title") title: string) {
    return prisma.eventCategory.create({
      data: { title },
    });
  }

  @Mutation(() => EventCategory, { nullable: true })
  async updateEventCategory(
    @Arg("id", () => ID) id: number,
    @Arg("title") title: string
  ) {
    return prisma.eventCategory.update({
      where: { id },
      data: { title },
    });
  }

  @Mutation(() => Boolean)
  async deleteEventCategory(@Arg("id", () => ID) id: number) {
    await prisma.eventCategory.delete({ where: { id } });
    return true;
  }
}
