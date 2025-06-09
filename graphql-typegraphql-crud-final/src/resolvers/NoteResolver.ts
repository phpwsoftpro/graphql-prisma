import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Note } from "../schema/Note";
import { NoteListResponse } from "../schema/NoteListResponse";
import {
  NoteFilter,
  NoteSort,
  CreateNoteInput,
  UpdateNoteInput,
  DeleteNoteInput,
} from "../schema/NoteInput";
import { OffsetPaging } from "../schema/PagingInput";

const prisma = new PrismaClient();

@Resolver(() => Note)
export class NoteResolver {
  @Query(() => NoteListResponse)
  async notes(
    @Arg("filter", () => NoteFilter, { nullable: true }) filter: NoteFilter,
    @Arg("sorting", () => [NoteSort], { nullable: true }) sorting: NoteSort[],
    @Arg("paging", () => OffsetPaging, { nullable: true }) paging: OffsetPaging
  ) {
    const where: any = {};
    if (filter?.id) {
      where.id = filter.id;
    }
    if (filter?.note) {
      where.note = { contains: filter.note };
    }
    if (filter?.company?.id?.eq) {
      where.companyId = filter.company.id.eq;
    }
    if (filter?.contact?.id?.eq) {
      where.contactId = filter.contact.id.eq;
    }
    if (filter?.createdById) {
      where.createdById = filter.createdById;
    }

    const orderBy = sorting?.map((s) => ({ [s.field]: s.direction.toLowerCase() })) ?? [{ createdAt: "desc" }];

    const skip = paging?.offset ?? 0;
    const take = paging?.limit ?? 10;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          company: true,
          contact: true,
          createdBy: true,
        },
      }),
      prisma.note.count({ where }),
    ]);

    return {
      nodes: notes,
      totalCount: total,
    };
  }

  @Query(() => Note)
  async note(@Arg("id", () => ID) id: string) {
    return prisma.note.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: true,
        contact: true,
        createdBy: true,
      },
    });
  }

  @Mutation(() => Note)
  async createNote(@Arg("input", () => CreateNoteInput) input: CreateNoteInput) {
    return prisma.note.create({
      data: input,
      include: {
        company: true,
        contact: true,
        createdBy: true,
      },
    });
  }

  @Mutation(() => Note)
  async updateNote(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateNoteInput) input: UpdateNoteInput
  ) {
    return prisma.note.update({
      where: { id: parseInt(id) },
      data: input,
      include: {
        company: true,
        contact: true,
        createdBy: true,
      },
    });
  }

  @Mutation(() => Note)
  async deleteNote(@Arg("input", () => DeleteNoteInput) input: DeleteNoteInput) {
    return prisma.note.delete({
      where: { id: input.id },
      include: {
        company: true,
        contact: true,
        createdBy: true,
      },
    });
  }
}
