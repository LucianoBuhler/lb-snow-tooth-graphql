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
    trailAccess: [Trail!]!
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
    groomed: Boolean!
    snowmaking: Boolean!
    trees: Boolean!
    night: Boolean!
    accessedByLifts: [Lift!]!
  }

  enum TrailDifficulty {
    beginner
    intermediate
    advanced
    expert
  }

  enum TrailStatus {
    OPEN
    CLOSED
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
    findTrailById: (parent, {id}) => 
      trails.find((trail) => trail.id === id)
  },
  Lift: {
    trailAccess: (parent) =>
      parent.trails.map((trailId) =>
        trails.find((trail) => trail.id === trailId)
      )
  },
  Trail: {
    accessedByLifts: (parent) =>
      parent.lift.map((liftId) =>
        lifts.find((lift) => lift.id === liftId)
      )
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