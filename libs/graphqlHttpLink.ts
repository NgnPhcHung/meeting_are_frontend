import { HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const graphqlHttpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
  fetchOptions: {
    cache: "no-store",
    credentials: "include",
  },
  credentials: "include",
});

export const graphqlWsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3001/graphql",
    on: {
      error: (err) => {
        console.error("GraphQL WS Client error:", err);
      },
      opened: () => {
        console.log("WebSocket connection opened");
      },
    },
  }),
);
