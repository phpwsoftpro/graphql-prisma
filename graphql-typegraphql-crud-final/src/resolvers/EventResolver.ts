import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Event } from "../schema/Event";
import { EventListResponse } from "../schema/EventListResponse";
import { EventFilter } from "../schema/EventFilter";
import { EventSort } from "../schema/EventSort";
import { OffsetPaging } from "../schema/PagingInput";
import { EventInput } from "../schema/EventInput";

const prisma = new PrismaClient();

@Resolver(() => Event)
export class EventResolver {
  @Query(() => EventListResponse)
  async events(
    @Arg("filter", () => EventFilter, { nullable: true }) filter: EventFilter,
    @Arg("sorting", () => [EventSort], { nullable: true }) sorting: EventSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
    const where: any = {};
    if (filter?.title) {
      where.title = { contains: filter.title };
    }
    if (filter?.description) {
      where.description = { contains: filter.description };
    }
    if (filter?.startDate) {
      where.startDate = {};
      if (filter.startDate.gte) {
        where.startDate.gte = filter.startDate.gte;
      }
      if (filter.startDate.lte) {
        where.startDate.lte = filter.startDate.lte;
      }
    }
    if (filter?.endDate) {
      where.endDate = {};
      if (filter.endDate.gte) {
        where.endDate.gte = filter.endDate.gte;
      }
      if (filter.endDate.lte) {
        where.endDate.lte = filter.endDate.lte;
      }
    }
    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter?.createdById) {
      where.createdById = filter.createdById;
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          createdBy: true,
          category: true,
          participants: true,
        },
      }),
      prisma.event.count({ where }),
    ]);

    return { nodes, totalCount };
  }

  @Query(() => Event, { nullable: true })
  async event(@Arg("id", () => ID) id: number) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: true,
        category: true,
        participants: true,
      },
    });
  }

  @Mutation(() => Event)
  async createEvent(@Arg("data") data: EventInput) {
    return prisma.event.create({
      data,
      include: {
        createdBy: true,
        category: true,
        participants: true,
      },
    });
  }

  @Mutation(() => Event, { nullable: true })
  async updateEvent(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: EventInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: true,
        category: true,
        participants: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg("id", () => ID) id: number) {
    await prisma.event.delete({ where: { id } });
    return true;
  }
}
