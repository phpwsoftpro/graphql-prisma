import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Contact } from "../schema/Contact";
import { ContactListResponse } from "../schema/ContactListResponse";
import {
  ContactInput,
  CreateContactInput,
  UpdateContactInput,
} from "../schema/ContactInput";
import { ContactFilter } from "../schema/ContactFilter";
import { ContactSort } from "../schema/ContactSort";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => Contact)
export class ContactResolver {
  @Query(() => ContactListResponse)
  async contacts(
    @Arg("filter", () => ContactFilter, { nullable: true }) filter: ContactFilter,
    @Arg("sorting", () => [ContactSort], { nullable: true }) sorting: ContactSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
    const where: any = {};
    if (filter?.name) {
      where.name = { contains: filter.name };
    }
    if (filter?.email) {
      where.email = { contains: filter.email };
    }
    if (filter?.phone) {
      where.phone = { contains: filter.phone };
    }
    if (filter?.companyId) {
      where.companyId = filter.companyId;
    }
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.description) {
      where.description = { contains: filter.description };
    }
    if (filter?.jobTitle) {
      where.jobTitle = { contains: filter.jobTitle };
    }
    if (filter?.salesOwnerId) {
      where.salesOwnerId = filter.salesOwnerId;
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.contact.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { 
          company: true,
          salesOwner: true
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return { nodes, totalCount };
  }

  @Query(() => Contact, { nullable: true })
  async contact(@Arg("id", () => ID) id: number | string) {
    return prisma.contact.findUnique({
      where: {
        id: typeof id === "string" ? Number(id) : id,
      },
      include: { 
        company: true,
        salesOwner: true
      },
    });
  }

  @Mutation(() => Contact)
  async createContact(
    @Arg("input", () => CreateContactInput) input: CreateContactInput
  ) {
    return prisma.contact.create({
      data: input.contact,
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Mutation(() => Contact)
  async updateContact(
    @Arg("input", () => UpdateContactInput) input: UpdateContactInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(input.update).filter(([, value]) => value !== undefined)
    ) as ContactInput;

    return prisma.contact.update({
      where: {
        id: typeof input.id === "string" ? Number(input.id) : input.id,
      },
      data: updateData,
      include: {
        company: true,
        salesOwner: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteContact(@Arg("id", () => ID) id: number | string) {
    await prisma.contact.delete({
      where: { id: typeof id === "string" ? Number(id) : id },
    });
    return true;
  }
}
