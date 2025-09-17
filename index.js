import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import lifts from "./data/lifts.json" with { type: "json" };
// import trails from "./data/trails.json" with { type: "json" };

const typeDefs = gql`
  type Query {
    liftCount: Int!
  }
`;

const resolvers = {
  Query: {
    liftCount: () => lifts.length
  }
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });
  console.log(`Snowtooth server running at ${url}`);
}

startApolloServer();