import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";

import { axiosInstance } from "./axios";

export const API_BASE_URL = "http://192.168.1.130:8000";
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
      const graphQLErrors = error?.response?.data?.errors || error;
      const messages = Array.isArray(graphQLErrors)
        ? graphQLErrors.map((e: any) => e?.message).join("")
        : error?.message;
      const code = Array.isArray(graphQLErrors)
        ? graphQLErrors[0]?.extensions?.code
        : error?.response?.status;

      return Promise.reject({
        message: messages || JSON.stringify(error),
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
