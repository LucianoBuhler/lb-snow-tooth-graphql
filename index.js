import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import lifts from "./data/lifts.json" with { type: "json" };
import trails from "./data/trails.json" with { type: "json" };

const typeDefs = gql`
  type Lift {
    id: ID!
    name: String!
    status: LiftStatus!
    capacity: Int!
    night: Boolean!
    elevationGain: Int
  }
  enum LiftStatus {
    OPEN
    CLOSED
    HOLD
  }

  type Trail {
    id: ID!
    name: String!
    difficulty: TrailDifficulty!
    status: TrailStatus!
    grromed: Boolean!
    snowmaking: Boolean!
    trees: Boolean!
    night: Boolean!
  }
  enum TrailStatus {
    OPEN
    CLOSED
  }
  enum TrailDifficulty {
    beginner
    intermediate
    advanced
    expert
  }
  type Query {
    liftCount: Int!
    allLifts: [Lift!]!
    findLiftById(id: ID!): Lift!
    trailCount: Int!
    allTrails: [Trail!]!
    findTrailById(id: ID!): Trail!
  }
`;

const resolvers = {
  Query: {
    liftCount: () => lifts.length,
    allLifts: () => lifts,
    findLiftById: (parent, args) => 
      lifts.find((lift) => lift.id === args.id),
    trailCount: () => trails.length,
    allTrails: () => trails,
    findTrailById: (parent, args) => 
      trails.find((trail) => trail.id === args.id)
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