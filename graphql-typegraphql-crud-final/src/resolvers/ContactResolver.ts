import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Contact } from "../schema/Contact";
import { CreateContactInput, UpdateContactInput } from "../schema/ContactInput";

const prisma = new PrismaClient();

@Resolver(() => Contact)
export class ContactResolver {
  @Query(() => [Contact])
  async contacts() {
    return prisma.contact.findMany({ include: { company: true } });
  }

  @Query(() => Contact, { nullable: true })
  async contact(@Arg("id", () => ID) id: number) {
    return prisma.contact.findUnique({ where: { id }, include: { company: true } });
  }

  @Mutation(() => Contact)
  async createContact(@Arg("data") data: CreateContactInput) {
    return prisma.contact.create({ data, include: { company: true } });
  }

  @Mutation(() => Contact, { nullable: true })
  async updateContact(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateContactInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateContactInput;
    return prisma.contact.update({ where: { id }, data: updateData, include: { company: true } });
  }

  @Mutation(() => Boolean)
  async deleteContact(@Arg("id", () => ID) id: number) {
    await prisma.contact.delete({ where: { id } });
    return true;
  }
}
