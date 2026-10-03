import { CSRF_HEADER_NAME, getCsrfToken } from "@/lib/csrf";
import { ApiError } from "./error";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ErrorResponseBody {
  message?: string;
  code?: string;
  type?: string;
  request_id?: string;
  details?: Array<Record<string, unknown>> | null;
  errors?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  let data: ErrorResponseBody;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      data = (await response.json()) as ErrorResponseBody;
    } catch {
      data = { message: await response.text() };
    }
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new ApiError({
      message: data.message || `Request failed with status ${response.status}`,
      code: data.code,
      type: data.type,
      request_id: data.request_id,
      details: data.details,
      errors: data.errors,
      status: response.status,
    });
  }

  return data as unknown as T;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...init } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value));
    }
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const csrfToken = getCsrfToken();
  const method = (init.method || "GET").toUpperCase();
  if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    defaultHeaders[CSRF_HEADER_NAME] = csrfToken;
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: mergedHeaders,
  });

  return handleResponse<T>(response);
}

apiClient.get = <T>(endpoint: string, options?: RequestOptions) =>
  apiClient<T>(endpoint, { ...options, method: "GET" });

apiClient.post = <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
  apiClient<T>(endpoint, {
    ...options,
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.put = <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
  apiClient<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.patch = <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
  apiClient<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.delete = <T>(endpoint: string, options?: RequestOptions) =>
  apiClient<T>(endpoint, { ...options, method: "DELETE" });
