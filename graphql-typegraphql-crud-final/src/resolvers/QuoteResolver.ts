import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Quote } from "../schema/Quote";
import { QuoteListResponse } from "../schema/QuoteListResponse";
import { QuoteFilter } from "../schema/QuoteFilter";
import { QuoteSort } from "../schema/QuoteSort";
import { OffsetPaging } from "../schema/PagingInput";
import { CreateQuoteInput, UpdateQuoteInput } from "../schema/QuoteInput";

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
      if (filter.title.contains) {
        where.title = { contains: filter.title.contains };
      } else if (filter.title.equals) {
        where.title = { equals: filter.title.equals };
      } else if (filter.title.startsWith) {
        where.title = { startsWith: filter.title.startsWith };
      } else if (filter.title.endsWith) {
        where.title = { endsWith: filter.title.endsWith };
      } else if (filter.title.iLike) {
        where.title = { contains: filter.title.iLike, mode: 'insensitive' };
      }
    }
    if (filter?.description) {
      if (filter.description.contains) {
        where.description = { contains: filter.description.contains };
      } else if (filter.description.equals) {
        where.description = { equals: filter.description.equals };
      } else if (filter.description.startsWith) {
        where.description = { startsWith: filter.description.startsWith };
      } else if (filter.description.endsWith) {
        where.description = { endsWith: filter.description.endsWith };
      } else if (filter.description.iLike) {
        where.description = { contains: filter.description.iLike, mode: 'insensitive' };
      }
    }
    if (filter?.status) {
      if (filter.status.equals) {
        where.status = filter.status.equals;
      }
    }
    if (filter?.companyId) {
      where.companyId = filter.companyId;
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
      where: { id },
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
  async createQuote(@Arg("data") data: CreateQuoteInput) {
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
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateQuoteInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
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

  @Mutation(() => Boolean)
  async deleteQuote(@Arg("id", () => ID) id: number) {
    await prisma.quote.delete({ where: { id } });
    return true;
  }
}
