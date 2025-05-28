import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Note } from "../schema/Note";
import { CreateNoteInput, UpdateNoteInput } from "../schema/NoteInput";

const prisma = new PrismaClient();

@Resolver(() => Note)
export class NoteResolver {
  @Query(() => [Note])
  async notes() {
    return prisma.note.findMany();
  }

  @Query(() => Note, { nullable: true })
  async note(@Arg("id", () => ID) id: number) {
    return prisma.note.findUnique({ where: { id } });
  }

  @Mutation(() => Note)
  async createNote(@Arg("data") data: CreateNoteInput) {
    return prisma.note.create({ data });
  }

  @Mutation(() => Note, { nullable: true })
  async updateNote(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateNoteInput
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ) as UpdateNoteInput;
    return prisma.note.update({ where: { id }, data: updateData });
  }

  @Mutation(() => Boolean)
  async deleteNote(@Arg("id", () => ID) id: number) {
    await prisma.note.delete({ where: { id } });
    return true;
  }
}
