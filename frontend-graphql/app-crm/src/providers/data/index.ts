import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";

import { axiosInstance } from "./axios";

// Lấy API_BASE_URL từ localStorage, fallback nếu không có
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("apiUrl") || "http://localhost:8000";
  }
  return "http://192.168.1.51:8000";
};

export const API_BASE_URL = getApiBaseUrl();
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
      const messages = error?.map((error: any) => error?.message)?.join("");
      const code = error?.[0]?.extensions?.code;

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
