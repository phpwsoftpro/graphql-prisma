import "reflect-metadata";
import { ApolloServer } from "apollo-server";
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
import { ChecklistResolver } from "./resolvers/ChecklistResolver";
import { AuditResolver } from "./resolvers/AuditResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { QuoteResolver } from "./resolvers/QuoteResolver";
import { DealStageResolver } from "./resolvers/DealStageResolver";
import { DealResolver } from "./resolvers/DealResolver";
import { ProjectResolver } from "./resolvers/ProjectResolver";

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
      ChecklistResolver,
      AuditResolver,
      ProductResolver,
      QuoteResolver,
      DealStageResolver,
      DealResolver,
      ProjectResolver,
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  const { url } = await server.listen(8000);
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap();
