import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Event } from "../schema/Event";
import { EventListResponse } from "../schema/EventListResponse";
import { EventFilter } from "../schema/EventFilter";
import { EventSort } from "../schema/EventSort";
import { OffsetPaging } from "../schema/PagingInput";
import { EventInput, CreateEventInput, UpdateEventInput } from "../schema/EventInput";

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
async event(@Arg("id", () => ID) id: number | string) {
  return prisma.event.findUnique({
    where: {
      id: typeof id === "string" ? Number(id) : id, // Ép kiểu về số
    },
    include: {
      createdBy: true,
      category: true,
      participants: true,
    },
  });
}

  @Mutation(() => Event)
async createEvent(
  @Arg("input", () => CreateEventInput) input: CreateEventInput
) {
  return prisma.event.create({
    data: {
      title: input.event.title,
      description: input.event.description,
      startDate: input.event.startDate,
      endDate: input.event.endDate,
      color: input.event.color,
      category: input.event.categoryId ? { connect: { id: input.event.categoryId } } : undefined,
      participants: input.event.participantIds?.length
        ? { connect: input.event.participantIds.map(id => ({ id })) }
        : undefined,
      // ... các trường khác nếu có
    },
    include: {
      createdBy: true,
      category: true,
      participants: true,
    },
  });
}

  
  @Mutation(() => Event)
  async updateEvent( @Arg("input", () => UpdateEventInput) input: UpdateEventInput) {
    return prisma.event.update({
      where: { id: input.id },
      data: {
        title: input.update.title,
        description: input.update.description,
        startDate: input.update.startDate,
        endDate: input.update.endDate,
        color: input.update.color,
        category: input.update.categoryId ? { connect: { id: input.update.categoryId } } : undefined,
        participants: input.update.participantIds
        ? { set: input.update.participantIds.map(id => ({ id })) }
        : undefined,
      },
      include: {
        createdBy: true,
        category: true,
        participants: true,
      },
    });
  }
  @Mutation(() => Boolean)
  async deleteEvent(@Arg("id", () => ID) id: number) {
    await prisma.event.delete({ where: { id: Number(id) } });
    return true;
  }
}
