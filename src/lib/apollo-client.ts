/**
 * Creates and returns a configured Apollo Client instance for communicating with a Hasura GraphQL endpoint.
 *
 * The client is configured with:
 * - an HttpLink whose `uri` is taken from the `NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT` environment variable,
 * - an InMemoryCache for caching query results.
 *
 * The function returns a ready-to-use ApolloClient instance suitable for use across the application.
 *
 * Note: This function assumes `NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT` is defined at build/runtime.
 * If the environment variable is missing or empty, network requests will fail.
 *
 * @returns {ApolloClient<any>} A configured Apollo Client instance.
 *
 * @example
 * const client = createApolloClient();
 */
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            companies: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
};

export default createApolloClient;
