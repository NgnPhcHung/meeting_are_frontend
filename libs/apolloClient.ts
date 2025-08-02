import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { cookies } from "next/headers";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { graphQLError } from "./graphqlError";

export const { getClient } = registerApolloClient(() => {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("authorization");

  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_HTTP_ENDPOINT ||
      "http://localhost:3001/graphql",
    credentials: "include",
    headers: {
      cookie: authCookie ? `authorization=${authCookie.value}` : "",
    },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url:
        process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT ||
        "ws://localhost:3001/graphql",
      connectionParams: {
        authorization: authCookie?.value,
      },
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  );
  const link = ApolloLink.from([graphQLError, splitLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
});
