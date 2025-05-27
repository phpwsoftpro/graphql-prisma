import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { TodoResolver } from "./resolvers/TodoResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { CompanyResolver } from "./resolvers/CompanyResolver";
import { ContactResolver } from "./resolvers/ContactResolver";

const prisma = new PrismaClient();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [TodoResolver, UserResolver, CompanyResolver, ContactResolver],
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
