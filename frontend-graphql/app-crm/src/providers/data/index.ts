import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";

import { axiosInstance } from "./axios";

export const API_BASE_URL = "http://192.168.1.51:8000";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = `ws://${API_BASE_URL}/graphql`;

export const client = new GraphQLClient(API_URL, {
  fetch: async (url: string, options: any) => {
    try {
      const response = await axiosInstance.request({
        data: options.body,
        url,
        ...options,
      });

      return response;
    } catch (error: any) {
      let graphQLErrors: any[] = [];

      if (Array.isArray(error)) {
        graphQLErrors = error;
      } else if (Array.isArray(error?.response?.data?.errors)) {
        graphQLErrors = error.response.data.errors;
      }

      const messages = graphQLErrors
        .map((err: any) => err?.message)
        .join("; ");
      const code =
        graphQLErrors[0]?.extensions?.code || error?.response?.status;

      return Promise.reject({
        message: messages || error?.message || JSON.stringify(error),
        statusCode: code || 500,
      });
    }
  },
});

export const wsClient = createClient({
  url: WS_URL,
  connectionParams: () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }),
});

export const dataProvider = graphqlDataProvider(client);

export const liveProvider = graphqlLiveProvider(wsClient);
