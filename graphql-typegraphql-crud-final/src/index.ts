import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TodoResolver } from "./resolvers/TodoResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { CompanyResolver } from "./resolvers/CompanyResolver";
import { ContactResolver } from "./resolvers/ContactResolver";
import { NoteResolver } from "./resolvers/NoteResolver";
import { NotificationResolver } from "./resolvers/NotificationResolver";
import { TokenResolver } from "./resolvers/TokenResolver";
import { TaskStageResolver } from "./resolvers/TaskStageResolver";
import { TaskResolver } from "./resolvers/TaskResolver";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { EventCategoryResolver } from "./resolvers/EventCategoryResolver";
import { ChecklistResolver } from "./resolvers/ChecklistResolver";
import { AuditResolver } from "./resolvers/AuditResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { QuoteResolver } from "./resolvers/QuoteResolver";
import { DealStageResolver } from "./resolvers/DealStageResolver";
import { DealResolver } from "./resolvers/DealResolver";
import { ProjectResolver } from "./resolvers/ProjectResolver";
import { EventResolver } from "./resolvers/EventResolver";
import { CommentResolver } from "./resolvers/CommentResolver";

const prisma = new PrismaClient();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      TodoResolver,
      UserResolver,
      CompanyResolver,
      ContactResolver,
      NoteResolver,
      NotificationResolver,
      TokenResolver,
      TaskStageResolver,
      TaskResolver,
      CategoryResolver,
      EventCategoryResolver,
      ChecklistResolver,
      AuditResolver,
      ProductResolver,
      QuoteResolver,
      DealStageResolver,
      DealResolver,
      ProjectResolver,
      EventResolver,
      CommentResolver,
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  await server.start();

  const app = express();

  app.get("/dashboard/counts", async (_req, res) => {
    const [companies, contacts, deals] = await Promise.all([
      prisma.company.count(),
      prisma.contact.count(),
      prisma.deal.count(),
    ]);

    res.json({ companies, contacts, deals });
  });

  server.applyMiddleware({ app });

  app.listen(8000, () => {
    console.log(
      `🚀 Server ready at http://localhost:8000${server.graphqlPath}`
    );
  });
}

bootstrap();
