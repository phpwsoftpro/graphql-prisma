import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Contact } from "../schema/Contact";
import { ContactListResponse } from "../schema/ContactListResponse";
import {
  ContactCreateInput,
  ContactUpdateInput,
  CreateContactInput,
  UpdateContactInput,
  DeleteContactInput,
  CreateManyContactsInput,
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
      if (typeof filter.name === 'string') {
        if ((filter.name as string).trim() !== '') {
          where.name = { contains: filter.name };
        }
      } else if (typeof filter.name.iLike === 'string' && filter.name.iLike !== '%%' && filter.name.iLike.trim() !== '') {
        where.name = { contains: filter.name.iLike, mode: 'insensitive' };
      } else if (typeof filter.name.contains === 'string' && filter.name.contains.trim() !== '') {
        where.name = { contains: filter.name.contains };
      } else if (typeof filter.name.eq === 'string' && filter.name.eq.trim() !== '') {
        where.name = filter.name.eq;
      }
    }
    if (filter?.email) {
      where.email = { contains: filter.email };
    }
    if (filter?.phone) {
      where.phone = { contains: filter.phone };
    }
    if (filter?.company?.id?.eq) {
      where.companyId = Number(filter.company.id.eq);
    }
    if (filter?.status) {
      where.status = filter.status;
    }
    if (filter?.description) {
      where.description = { contains: filter.description };
    }
    if (filter?.jobTitle) {
      if (typeof filter.jobTitle === 'string') {
        if ((filter.jobTitle as string).trim() !== '') {
          where.jobTitle = { contains: filter.jobTitle };
        }
      } else if (typeof filter.jobTitle.iLike === 'string' && filter.jobTitle.iLike !== '%%' && filter.jobTitle.iLike.trim() !== '') {
        where.jobTitle = { contains: filter.jobTitle.iLike, mode: 'insensitive' };
      } else if (typeof filter.jobTitle.contains === 'string' && filter.jobTitle.contains.trim() !== '') {
        where.jobTitle = { contains: filter.jobTitle.contains };
      } else if (typeof filter.jobTitle.eq === 'string' && filter.jobTitle.eq.trim() !== '') {
        where.jobTitle = filter.jobTitle.eq;
      }
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
    const {
      companyId,
      salesOwnerId,
      ...rest
    } = input.contact;

    return prisma.contact.create({
      data: {
        ...rest,
        company: companyId ? { connect: { id: companyId } } : undefined,
        salesOwner: salesOwnerId ? { connect: { id: salesOwnerId } } : undefined,
      },
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
    const {
      companyId,
      salesOwnerId,
      ...rest
    } = input.update;

    const updateData: any = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined)
    );

    if (companyId !== undefined) {
      updateData.company = companyId
        ? { connect: { id: companyId } }
        : { disconnect: true };
    }

    if (salesOwnerId !== undefined) {
      updateData.salesOwner = salesOwnerId
        ? { connect: { id: salesOwnerId } }
        : { disconnect: true };
    }

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
  async deleteContact(@Arg("input", () => DeleteContactInput) input: DeleteContactInput) {
    await prisma.contact.delete({
      where: { id: Number(input.id) },
    });
    return true;
  }

  @Mutation(() => [Contact])
  async createManyContacts(
    @Arg("input", () => CreateManyContactsInput) input: CreateManyContactsInput
  ) {
    const createdContacts = await Promise.all(
      input.contacts.map(async (contactInput) => {
        const { companyId, salesOwnerId, ...rest } = contactInput;
        return prisma.contact.create({
          data: {
            ...rest,
            company: companyId ? { connect: { id: Number(companyId) } } : undefined,
            salesOwner: salesOwnerId ? { connect: { id: Number(salesOwnerId) } } : undefined,
          },
          include: {
            company: true,
            salesOwner: true,
          },
        });
      })
    );
    return createdContacts;
  }
}
