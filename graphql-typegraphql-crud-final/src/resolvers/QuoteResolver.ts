import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Quote } from "../schema/Quote";
import { QuoteListResponse } from "../schema/QuoteListResponse";
import { QuoteFilter } from "../schema/QuoteFilter";
import { QuoteSort } from "../schema/QuoteSort";
import { OffsetPaging } from "../schema/PagingInput";
import { CreateQuoteInput, DeleteQuoteInput, UpdateQuoteInput } from "../schema/QuoteInput";

const prisma = new PrismaClient();

@Resolver(() => Quote)
export class QuoteResolver {
  @Query(() => QuoteListResponse)
  async quotes(
    @Arg("filter", () => QuoteFilter, { nullable: true }) filter: QuoteFilter,
    @Arg("sorting", () => [QuoteSort], { nullable: true }) sorting: QuoteSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
    const where: any = {};
    if (filter?.title) {
      if (typeof filter.title === 'string') {
        if ((filter.title as string).trim() !== '' && filter.title !== '%%') {
          where.title = { contains: filter.title as string };
        }
      } else if (typeof filter.title.iLike === 'string' && filter.title.iLike !== '%%' && filter.title.iLike.trim() !== '') {
        where.title = { contains: filter.title.iLike, mode: 'insensitive' };
      } else if (typeof filter.title.contains === 'string' && filter.title.contains.trim() !== '' && filter.title.contains !== '%%') {
        where.title = { contains: filter.title.contains };
      } else if (typeof filter.title.eq === 'string' && filter.title.eq.trim() !== '' && filter.title.eq !== '%%') {
        where.title = filter.title.eq;
      }
    }
    if (filter?.description) {
      if (typeof filter.description === 'string') {
        if ((filter.description as string).trim() !== '' && filter.description !== '%%') {
          where.description = { contains: filter.description as string };
        }
      } else if (typeof filter.description.iLike === 'string' && filter.description.iLike !== '%%' && filter.description.iLike.trim() !== '') {
        where.description = { contains: filter.description.iLike, mode: 'insensitive' };
      } else if (typeof filter.description.contains === 'string' && filter.description.contains.trim() !== '' && filter.description.contains !== '%%') {
        where.description = { contains: filter.description.contains };
      } else if (typeof filter.description.eq === 'string' && filter.description.eq.trim() !== '' && filter.description.eq !== '%%') {
        where.description = filter.description.eq;
      }
    }
    if (filter?.status) {
      if (typeof filter.status === 'string') {
        if ((filter.status as string).trim() !== '' && filter.status !== '%%') {
          where.status = { contains: filter.status as string };
        }
      } else if (typeof filter.status.iLike === 'string' && filter.status.iLike !== '%%' && filter.status.iLike.trim() !== '') {
        where.status = { contains: filter.status.iLike, mode: 'insensitive' };
      } else if (typeof filter.status.contains === 'string' && filter.status.contains.trim() !== '' && filter.status.contains !== '%%') {
        where.status = { contains: filter.status.contains };
      } else if (typeof filter.status.eq === 'string' && filter.status.eq.trim() !== '' && filter.status.eq !== '%%') {
        where.status = filter.status.eq;
      }
    }
    if (filter?.company?.id?.eq) {
      where.companyId = Number(filter.company.id.eq);
    }
    if (filter?.salesOwnerId) {
      where.salesOwnerId = filter.salesOwnerId;
    }
    if (filter?.contactId) {
      where.contactId = filter.contactId;
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [nodes, totalCount] = await prisma.$transaction([
      prisma.quote.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          company: true,
          salesOwner: true,
          contact: true,
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.quote.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedNodes = nodes.map(quote => ({
      ...quote,
      items: quote.items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice: item.totalPrice
      }))
    }));

    return { nodes: transformedNodes, totalCount };
  }

  @Query(() => Quote, { nullable: true })
  async quote(@Arg("id", () => ID) id: number) {
    const quote = await prisma.quote.findUnique({
      where: { id: Number(id) },
      include: {
        company: true,
        salesOwner: true,
        contact: true,
        items: {
          include: {
            product: true
          }
        }
      },
    });

    if (!quote) return null;

    // Transform the data to match the expected format
    return {
      ...quote,
      items: quote.items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice: item.totalPrice
      }))
    };
  }

  @Mutation(() => Quote)
  async createQuote(@Arg("input", () => CreateQuoteInput) input: CreateQuoteInput) {
    const quoteData = input.quote;
    const { companyId, salesOwnerId, contactId, ...rest } = quoteData;
    const data: any = { 
      ...rest,
      subTotal: 0,  // Default value
      total: 0,     // Default value
      status: quoteData.status || 'DRAFT'  // Default status if not provided
    };
    if (companyId !== undefined) {
      data.company = { connect: { id: Number(companyId) } };
    }
    if (salesOwnerId !== undefined) {
      data.salesOwner = { connect: { id: Number(salesOwnerId) } };
    }
    if (contactId !== undefined) {
      data.contact = { connect: { id: Number(contactId) } };
    }
    const quote = await prisma.quote.create({
      data,
      include: {
        company: true,
        salesOwner: true,
        contact: true,
        items: {
          include: {
            product: true
          }
        }
      },
    });

    // Transform the data to match the expected format
    return {
      ...quote,
      items: quote.items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice: item.totalPrice
      }))
    };
  }

  @Mutation(() => Quote, { nullable: true })
  async updateQuote(
    @Arg("input", () => UpdateQuoteInput) input: UpdateQuoteInput
  ) {
    const { id, update } = input;
    const { companyId, salesOwnerId, contactId, ...rest } = update;
    const data: any = { ...rest };
    if (companyId !== undefined) {
      data.company = companyId ? { connect: { id: Number(companyId) } } : { disconnect: true };
    }
    if (salesOwnerId !== undefined) {
      data.salesOwner = salesOwnerId ? { connect: { id: Number(salesOwnerId) } } : { disconnect: true };
    }
    if (contactId !== undefined) {
      data.contact = contactId ? { connect: { id: Number(contactId) } } : { disconnect: true };
    }
    const quote = await prisma.quote.update({
      where: { id: Number(id) },
      data,
      include: {
        company: true,
        salesOwner: true,
        contact: true,
        items: {
          include: {
            product: true
          }
        }
      },
    });

    // Transform the data to match the expected format
    return {
      ...quote,
      items: quote.items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice: item.totalPrice
      }))
    };
  }

  @Mutation(() => Quote)
  async deleteQuote(@Arg("input", () => DeleteQuoteInput) input: DeleteQuoteInput) {
    return prisma.quote.delete({ where: { id: Number(input.id) } });
   
  }
}
