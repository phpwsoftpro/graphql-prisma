import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Contact } from "../schema/Contact";
import { CreateContactInput, UpdateContactInput } from "../schema/ContactInput";

const prisma = new PrismaClient();

@Resolver(() => Contact)
export class ContactResolver {
  @Query(() => [Contact])
  async contacts() {
    return prisma.contact.findMany();
  }

  @Query(() => Contact, { nullable: true })
  async contact(@Arg("id", () => ID) id: number) {
    return prisma.contact.findUnique({ where: { id } });
  }

  @Mutation(() => Contact)
  async createContact(@Arg("data") data: CreateContactInput) {
    return prisma.contact.create({ data });
  }

  @Mutation(() => Contact, { nullable: true })
  async updateContact(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateContactInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateContactInput;
    return prisma.contact.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteContact(@Arg("id", () => ID) id: number) {
    await prisma.contact.delete({ where: { id } });
    return true;
  }
}
