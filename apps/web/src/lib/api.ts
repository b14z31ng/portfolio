/**
 * API client configuration for the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  private get baseUrl(): string {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes(".onrender.com")) {
        const apiHost = host.replace("-web", "-api");
        return `${window.location.protocol}//${apiHost}`;
      }
    }
    return this._baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("access_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  async request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const isFormData = fetchOptions.body instanceof FormData;
    const headers: Record<string, string> = {
      ...this.getAuthHeaders(),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Merge custom headers
    if (fetchOptions.headers) {
      Object.entries(fetchOptions.headers).forEach(([key, value]) => {
        headers[key] = String(value);
      });
    }

    // If FormData, we let the browser set the Content-Type header with the boundary
    if (isFormData && headers["Content-Type"]) {
      delete headers["Content-Type"];
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/admin/login";
          }
        }
        throw new ApiError(
          response.status,
          error.detail || response.statusText,
          error
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (err) {
      console.error(`[API CLIENT ERROR] Failed to fetch URL: ${url}`, err);
      throw err;
    }
  }

  get<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient(API_BASE_URL);

/**
 * Returns the correct API base URL for direct browser navigation
 * (download links, iframes, print windows).
 * Must be called client-side only.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes(".onrender.com")) {
      const apiHost = host.replace("-web", "-api");
      return `${window.location.protocol}//${apiHost}`;
    }
  }
  return "";  // empty = same origin (works with Next.js rewrites locally)
}
