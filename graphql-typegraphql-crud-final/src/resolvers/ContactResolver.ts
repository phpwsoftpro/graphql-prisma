import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Contact } from "../schema/Contact";
import { ContactListResponse } from "../schema/ContactListResponse";
import { CreateContactInput, UpdateContactInput } from "../schema/ContactInput";
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
  async contact(@Arg("id", () => ID) id: number) {
    return prisma.contact.findUnique({
      where: { id },
      include: { 
        company: true,
        salesOwner: true
      },
    });
  }

  @Mutation(() => Contact)
  async createContact(@Arg("data") data: CreateContactInput) {
    return prisma.contact.create({
      data,
      include: { 
        company: true,
        salesOwner: true
      },
    });
  }

  @Mutation(() => Contact, { nullable: true })
  async updateContact(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateContactInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateContactInput;

    return prisma.contact.update({
      where: { id },
      data: updateData,
      include: { 
        company: true,
        salesOwner: true
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteContact(@Arg("id", () => ID) id: number) {
    await prisma.contact.delete({ where: { id } });
    return true;
  }
}
