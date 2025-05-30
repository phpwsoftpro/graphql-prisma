import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { EventCategory } from "../schema/EventCategory";
import { EventCategoryConnection } from "../schema/EventCategoryConnection";
import { CreateEventCategoryInput, UpdateEventCategoryInput } from "../schema/EventCategoryInput";

const prisma = new PrismaClient();

@Resolver(() => EventCategory)
export class EventCategoryResolver {
  @Query(() => EventCategoryConnection)
  async eventCategories() {
    const [nodes, totalCount] = await Promise.all([
      prisma.eventCategory.findMany(),
      prisma.eventCategory.count(),
    ]);
    return { nodes, totalCount };
  }

  @Query(() => EventCategory, { nullable: true })
  async eventCategory(@Arg("id", () => ID) id: number) {
    return prisma.eventCategory.findUnique({ where: { id } });
  }

  @Mutation(() => EventCategory)
  async createEventCategory(@Arg("data") data: CreateEventCategoryInput) {
    return prisma.eventCategory.create({ data });
  }

  @Mutation(() => EventCategory, { nullable: true })
  async updateEventCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateEventCategoryInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateEventCategoryInput;
    return prisma.eventCategory.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteEventCategory(@Arg("id", () => ID) id: number) {
    await prisma.eventCategory.delete({ where: { id } });
    return true;
  }
}
