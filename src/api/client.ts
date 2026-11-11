import axios, { AxiosInstance } from "axios";

import { createMockApiClient } from "@/api/mock/mockApiClient";
import { USE_MOCK_DATA } from "@/constants/env";
import { authStorage } from "@/services/authStorage";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method: RequestMethod;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
  retry?: { maxAttempts?: number; backoffMs?: number };
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiErrorData {
  code?: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, data: ApiErrorData) {
    super(data.message);
    this.name = "ApiError";
    this.status = status;
    this.code = data.code;
    this.details = data.details;
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  defaultTimeoutMs?: number;
  getAuthToken?: () => Promise<string | undefined>;
  onAuthFailure?: () => void | Promise<void>;
  onRequest?: (url: string, options: RequestOptions) => void;
  onResponse?: (url: string, status: number, data: unknown) => void;
}

export interface ApiClientInterface {
  get<T = unknown>(
    path: string,
    query?: RequestOptions["query"],
    opts?: Partial<RequestOptions>,
  ): Promise<T>;
  post<T = unknown>(
    path: string,
    body?: unknown,
    opts?: Partial<RequestOptions>,
  ): Promise<T>;
  put<T = unknown>(
    path: string,
    body?: unknown,
    opts?: Partial<RequestOptions>,
  ): Promise<T>;
  patch<T = unknown>(
    path: string,
    body?: unknown,
    opts?: Partial<RequestOptions>,
  ): Promise<T>;
  delete<T = unknown>(path: string, opts?: Partial<RequestOptions>): Promise<T>;
  request<T = unknown>(path: string, options: RequestOptions): Promise<T>;
}

export function createApiClient(config: ApiClientConfig): ApiClientInterface {
  // Render free-tier instances spin down when idle and can take 20-50s to cold-start
  // on the next request, so the timeout has to be generous enough to survive that.
  const defaultTimeout = config.defaultTimeoutMs ?? 45000;

  const instance: AxiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: defaultTimeout,
  });

  function cleanQuery(query?: RequestOptions["query"]) {
    if (!query) return undefined;
    const entries = Object.entries(query).filter(
      ([, v]) => v !== undefined && v !== null,
    );
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  async function requestInternal<T>(
    path: string,
    options: RequestOptions,
    attempt = 1,
  ): Promise<T> {
    const {
      query,
      body,
      auth = true,
      timeoutMs,
      retry,
      headers,
      signal,
      method,
    } = options;
    // GETs are safe to retry automatically (idempotent); writes only retry if the
    // caller explicitly opts in, so a cold-start timeout can't silently double-submit.
    const effectiveRetry =
      retry ??
      (method === "GET" ? { maxAttempts: 2, backoffMs: 1500 } : undefined);

    const reqHeaders: Record<string, string> = { ...headers };
    if (auth && config.getAuthToken) {
      const token = await config.getAuthToken();
      if (token) reqHeaders.Authorization = `Bearer ${token}`;
    }

    config.onRequest?.(path, options);

    try {
      const response = await instance.request<T>({
        url: path,
        method,
        params: cleanQuery(query),
        data: body,
        headers: reqHeaders,
        timeout: timeoutMs ?? defaultTimeout,
        signal,
      });

      config.onResponse?.(path, response.status, response.data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status;
          if (status === 401 && config.onAuthFailure) {
            await config.onAuthFailure();
          }
          const data = err.response.data;
          const errData: ApiErrorData =
            typeof data === "object" && data !== null && "message" in data
              ? (data as ApiErrorData)
              : { message: `Request failed (${status})` };
          throw new ApiError(status, errData);
        }

        const maxAttempts = effectiveRetry?.maxAttempts ?? 1;
        const backoff = effectiveRetry?.backoffMs ?? 0;
        if (attempt < maxAttempts) {
          if (backoff > 0)
            await new Promise((r) => setTimeout(r, backoff * attempt));
          return requestInternal<T>(path, options, attempt + 1);
        }
      }
      throw err;
    }
  }

  return {
    request: <T>(path: string, options: RequestOptions) =>
      requestInternal<T>(path, options),
    get: <T>(path, query, opts) =>
      requestInternal<T>(path, { method: "GET", query, ...opts }),
    post: <T>(path, body, opts) =>
      requestInternal<T>(path, { method: "POST", body, ...opts }),
    put: <T>(path, body, opts) =>
      requestInternal<T>(path, { method: "PUT", body, ...opts }),
    patch: <T>(path, body, opts) =>
      requestInternal<T>(path, { method: "PATCH", body, ...opts }),
    delete: <T>(path, opts) =>
      requestInternal<T>(path, { method: "DELETE", ...opts }),
  };
}

export const apiClient: ApiClientInterface = USE_MOCK_DATA
  ? createMockApiClient()
  : createApiClient({
      baseUrl:
        process.env.EXPO_PUBLIC_API_BASE_URL ??
        "https://dang-y2k5.onrender.com/",
      getAuthToken: () => authStorage.getAccessToken(),
      onAuthFailure: () => authStorage.clearSession(),
    });
