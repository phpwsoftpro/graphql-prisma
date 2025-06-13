import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: 4000 });
  console.log(`🚀 Payroll GraphQL server ready at ${url}`);
}

startServer().catch((err) => {
  console.error('Failed to start server', err);
});
