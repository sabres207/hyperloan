import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema.graphql.js'
import { resolvers } from './resolvers.js'
import { AppDataSource } from './db/data-source.js'
import { Context, createContext } from './context.js'

async function main() {
  await AppDataSource.initialize()
  const server = new ApolloServer<Context>({ typeDefs, resolvers })
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: createContext,
  })

  console.log(`Server ready at ${url}`)
}

main().catch(console.error)
