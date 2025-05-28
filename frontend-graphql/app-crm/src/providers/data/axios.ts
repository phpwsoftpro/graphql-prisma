import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { refreshTokens, shouldRefreshToken } from "./refresh-token";

// Store logs in memory
const debugLogs: string[] = [];

// Unified logger
function logAndStore(...args: any[]) {
  const message = args
    .map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
    )
    .join(" ");
  console.log(message);
  debugLogs.push(message);
}

// Trigger browser download of the logs
function downloadLogs() {
  const blob = new Blob([debugLogs.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "axios-debug-log.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Expose the function globally
(window as any).downloadAxiosLogs = downloadLogs;

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json, text/plain, */*",
    "Apollo-Require-Preflight": "true",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && config?.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log request
    logAndStore("[REQUEST]");
    try {
      logAndStore("URL:", new URL(config.url!, window.location.origin).href);
    } catch {
      logAndStore("URL:", config.url);
    }
    logAndStore("Method:", config.method);
    logAndStore("Headers:", config.headers);

    let parsedData = config.data;
    if (typeof config.data === "string") {
      try {
        parsedData = JSON.parse(config.data);
      } catch {
        parsedData = config.data;
      }
    }

    logAndStore(
      "Data (body):\n",
      typeof parsedData === "object"
        ? JSON.stringify(parsedData, null, 2)
        : parsedData
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    // Log response
    logAndStore("[RESPONSE]");
    try {
      logAndStore(
        "URL:",
        new URL(response.config?.url!, window.location.origin).href
      );
    } catch {
      logAndStore("URL:", response.config?.url);
    }
    logAndStore("Status:", response.status);
    logAndStore("Data:", JSON.stringify(response.data, null, 2));

    convertAxiosToFetchResponse(response);

    const data = response?.data;
    const errors = data?.errors;
    const originalRequest = response.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    if (errors) {
      if (shouldRefreshToken(response) && !originalRequest?._retry) {
        const tokens = await refreshTokens();
        if (!tokens) throw errors;

        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      }

      SetResponseOk(response, false);
      throw errors;
    }

    return response;
  },
  (error) => {
    // Log error response
    logAndStore("[ERROR RESPONSE]");
    if (error.response) {
      try {
        logAndStore(
          "URL:",
          new URL(error.response.config?.url!, window.location.origin).href
        );
      } catch {
        logAndStore("URL:", error.response.config?.url);
      }
      logAndStore("Status:", error.response.status);
      logAndStore("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      logAndStore("Error Message:", error.message);
    }

    SetResponseOk(error, false);
    return Promise.reject(error);
  }
);

// Compatibility adapter
const convertAxiosToFetchResponse = (response: AxiosResponse) => {
  // @ts-ignore
  response.headers["forEach"] = function (callback: any) {
    for (const header in this) {
      if (Object.hasOwn(this, header)) {
        callback(this[header], header, this);
      }
    }
  };
  // @ts-ignore
  response["text"] = async function () {
    return JSON.stringify(this.data);
  };
  SetResponseOk(response, true);
};

const SetResponseOk = (response: AxiosResponse, ok: boolean) => {
  // @ts-ignore
  response["ok"] = ok;
};
