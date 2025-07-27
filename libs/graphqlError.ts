import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations/auth";
import { RefreshAccessToken } from "@/types/authResponse";
import {
  GraphQLExtensions,
  GraphqlCustomError,
  NetworkOperationError,
} from "@/types/graphql";
import { setCookie } from "@/utils/setAuthCookie";
import {
  ApolloClient,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

let isRefreshing = false;
let pendingRequests: ((value: unknown) => void)[] = [];

const FIFTEEN_MINS = 15 * 60;
function resolvePendingRequests(): void {
  pendingRequests.forEach((resolve) => resolve(undefined));
  pendingRequests = [];
}

const createRefreshClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.APP_URL || "http://localhost:3001/graphql",
    fetchOptions: {
      credentials: "include",
    },
    credentials: "include",
  });
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    credentials: "include",
    defaultOptions: {
      mutate: {
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
};

export const graphQLError = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    let finalErrorToPropagate: Error | null = null;

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        const extensions = err.extensions as GraphQLExtensions | undefined;
        const outerExceptionWrapper = extensions?.exception;
        const innerServerExceptionDetails = outerExceptionWrapper?.exception;
        const isAuthError = extensions?.exception?.statusCode === 401;

        if (isAuthError) {
          // if (isRefreshing) {
          //   return new Observable((observer) => {
          //     pendingRequests.push(() => {
          //       forward(operation).subscribe(observer);
          //     });
          //   });
          // }
          // isRefreshing = true;
          //
          // return new Observable((observer) => {
          //   const refreshClient = createRefreshClient();
          //
          //   refreshClient
          //     .mutate({ mutation: REFRESH_TOKEN_MUTATION })
          //     .then((response: FetchResult<RefreshAccessToken>) => {
          //       const newAccessToken =
          //         response.data?.refreshAccessToken?.accessToken;
          //       console.log(
          //         "resfresh access",
          //         response.data?.refreshAccessToken,
          //       );
          //
          //       if (newAccessToken) {
          //         setCookie(
          //           "authorization",
          //           `Bearer ${newAccessToken}`,
          //           FIFTEEN_MINS,
          //         );
          //         operation.setContext(({ headers = {} }) => ({
          //           headers: {
          //             ...headers,
          //             authorization: `Bearer ${newAccessToken}`,
          //           },
          //         }));
          //         isRefreshing = false;
          //         resolvePendingRequests();
          //         forward(operation).subscribe(observer);
          //       } else {
          //         console.error(
          //           "Token refresh succeeded, but no new access token received. Redirecting to login.",
          //         );
          //       }
          //     });
          // });
        }

        if (innerServerExceptionDetails) {
          finalErrorToPropagate = new GraphqlCustomError(
            innerServerExceptionDetails,
            err.message,
          );
          break;
        }
      }

      if (!finalErrorToPropagate && graphQLErrors.length > 0) {
        finalErrorToPropagate = new GraphqlCustomError(
          undefined,
          graphQLErrors[0].message,
        );
      }
    } else if (networkError) {
      let message = networkError.message;
      finalErrorToPropagate = new NetworkOperationError(message, networkError);
    }

    if (finalErrorToPropagate) {
      return new Observable((observer) => {
        observer.error(finalErrorToPropagate);
      });
    }

    return forward(operation);
  },
);
