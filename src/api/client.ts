import { authStorage } from '@/services/authStorage'

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions extends RequestInit {
  method: RequestMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  auth?: boolean
  timeoutMs?: number
  retry?: { maxAttempts?: number; backoffMs?: number }
}

export interface ApiErrorData {
  code?: string
  message: string
  details?: unknown
}

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown
  constructor(status: number, data: ApiErrorData) {
    super(data.message)
    this.name = 'ApiError'
    this.status = status
    this.code = data.code
    this.details = data.details
  }
}

export interface ApiClientConfig {
  baseUrl: string
  defaultTimeoutMs?: number
  getAuthToken?: () => Promise<string | undefined>
  onAuthFailure?: () => void | Promise<void>
  onRequest?: (url: string, options: RequestOptions) => void
  onResponse?: (url: string, response: Response, data: unknown) => void
}

export interface ApiClientInterface {
  get<T = unknown>(path: string, query?: RequestOptions['query'], opts?: Partial<RequestOptions>): Promise<T>
  post<T = unknown>(path: string, body?: unknown, opts?: Partial<RequestOptions>): Promise<T>
  put<T = unknown>(path: string, body?: unknown, opts?: Partial<RequestOptions>): Promise<T>
  patch<T = unknown>(path: string, body?: unknown, opts?: Partial<RequestOptions>): Promise<T>
  delete<T = unknown>(path: string, opts?: Partial<RequestOptions>): Promise<T>
  request<T = unknown>(path: string, options: RequestOptions): Promise<T>
}

export function createApiClient(config: ApiClientConfig): ApiClientInterface {
  const defaultTimeout = config.defaultTimeoutMs ?? 15000

  function buildUrl(path: string, query?: RequestOptions['query']): string {
    const base = config.baseUrl.replace(/\/$/, '')
    const p = path.startsWith('/') ? path : `/${path}`
    const url = new URL(`${base}${p}`)
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
      })
    }
    return url.toString()
  }

  async function requestInternal<T>(
    path: string,
    options: RequestOptions,
    attempt = 1,
  ): Promise<T> {
    const { query, body, auth = true, timeoutMs, retry, ...init } = options
    const url = buildUrl(path, query)
    const headers = new Headers(init.headers)
    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (auth && config.getAuthToken) {
      const token = await config.getAuthToken()
      if (token) headers.set('Authorization', `Bearer ${token}`)
    }
    config.onRequest?.(url, options)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs ?? defaultTimeout)

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
        signal: init.signal ?? controller.signal,
      })
      clearTimeout(timeout)

      let data: unknown = null
      const text = await response.text()
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = text
      }

      config.onResponse?.(url, response, data)

      if (!response.ok) {
        if (response.status === 401 && config.onAuthFailure) {
          await config.onAuthFailure()
        }
        const errData: ApiErrorData =
          typeof data === 'object' && data !== null && 'message' in data
            ? (data as ApiErrorData)
            : { message: `Request failed (${response.status})` }
        throw new ApiError(response.status, errData)
      }

      return data as T
    } catch (err) {
      clearTimeout(timeout)
      if (err instanceof ApiError) throw err

      const maxAttempts = retry?.maxAttempts ?? 1
      const backoff = retry?.backoffMs ?? 0
      if (attempt < maxAttempts) {
        if (backoff > 0) await new Promise(r => setTimeout(r, backoff * attempt))
        return requestInternal<T>(path, options, attempt + 1)
      }
      throw err
    }
  }

  return {
    request: <T,>(path: string, options: RequestOptions) => requestInternal<T>(path, options),
    get: <T,>(path, query, opts) =>
      requestInternal<T>(path, { method: 'GET', query, ...opts }),
    post: <T,>(path, body, opts) =>
      requestInternal<T>(path, { method: 'POST', body, ...opts }),
    put: <T,>(path, body, opts) =>
      requestInternal<T>(path, { method: 'PUT', body, ...opts }),
    patch: <T,>(path, body, opts) =>
      requestInternal<T>(path, { method: 'PATCH', body, ...opts }),
    delete: <T,>(path, opts) =>
      requestInternal<T>(path, { method: 'DELETE', ...opts }),
  }
}

export const apiClient: ApiClientInterface = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://dang-y2k5.onrender.com/api/v1',
  getAuthToken: () => authStorage.getAccessToken(),
  onAuthFailure: () => authStorage.clearSession(),
})
