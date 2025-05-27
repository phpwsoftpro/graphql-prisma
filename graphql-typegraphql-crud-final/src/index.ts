import "reflect-metadata"
import { ApolloServer } from "apollo-server"
import { buildSchema } from "type-graphql"
import { PrismaClient } from "@prisma/client"
import { TodoResolver } from "./resolvers/TodoResolver"

const prisma = new PrismaClient()

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [TodoResolver],
    validate: false,
  })

  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  })

  const { url } = await server.listen(8000)
  console.log(`🚀 Server ready at ${url}`)
}

bootstrap()
