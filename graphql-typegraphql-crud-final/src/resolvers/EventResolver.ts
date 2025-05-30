import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Event } from "../schema/Event";
import { CreateEventInput, UpdateEventInput } from "../schema/EventInput";

const prisma = new PrismaClient();

@Resolver(() => Event)
export class EventResolver {
  @Query(() => [Event])
  async events() {
    return prisma.event.findMany();
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
  async createEvent(@Arg("data") data: CreateEventInput) {
    return prisma.event.create({ data });
  }

  @Mutation(() => Event, { nullable: true })
  async updateEvent(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateEventInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateEventInput;
    return prisma.event.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg("id", () => ID) id: number) {
    await prisma.event.delete({ where: { id } });
    return true;
  }
}
