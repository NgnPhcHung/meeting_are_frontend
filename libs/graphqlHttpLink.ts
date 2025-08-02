import { HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const graphqlHttpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_HTTP_ENDPOINT ||
    "http://localhost:3001/graphql",
  credentials: "include",
  fetchOptions: {
    cache: "no-store",
    credentials: "include",
  },
});

export const graphqlWsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT ||
      "ws://localhost:3001/graphql",
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
