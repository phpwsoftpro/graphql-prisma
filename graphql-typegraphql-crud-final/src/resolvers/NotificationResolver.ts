import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Notification } from "../schema/Notification";
import { CreateNotificationInput, UpdateNotificationInput } from "../schema/NotificationInput";

const prisma = new PrismaClient();

@Resolver(() => Notification)
export class NotificationResolver {
  @Query(() => [Notification])
  async notifications() {
    return prisma.notification.findMany();
  }

  @Query(() => Notification, { nullable: true })
  async notification(@Arg("id", () => ID) id: number) {
    return prisma.notification.findUnique({ where: { id } });
  }

  @Mutation(() => Notification)
  async createNotification(@Arg("data") data: CreateNotificationInput) {
    return prisma.notification.create({ data });
  }

  @Mutation(() => Notification, { nullable: true })
  async updateNotification(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateNotificationInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateNotificationInput;
    return prisma.notification.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteNotification(@Arg("id", () => ID) id: number) {
    await prisma.notification.delete({ where: { id } });
    return true;
  }
}
