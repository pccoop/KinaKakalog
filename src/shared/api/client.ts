import { siteConfig } from "@/config/site.config";
import { tokenStorage } from "./storage";
import { ApiError, type ApiErrorResponse, type TokenPair } from "./types";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

function resolveApiUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = siteConfig.api.baseUrl.replace(/\/$/, "");
  const path = url.replace(/^\//, "");
  if (base.endsWith("/api") && path.startsWith("api/")) {
    return `${base}/${path.slice(4)}`;
  }
  return `${base}/${path}`;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiFetch<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...restOptions } = options;

  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type") && !(restOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const targetUrl = resolveApiUrl(url);

  const response = await fetch(targetUrl, {
    ...restOptions,
    headers,
  });

  if (response.status === 401 && !skipAuth && !url.includes("/auth/login") && !url.includes("/auth/refresh")) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clear();
      throw new ApiError("Сессия истекла. Пожалуйста, войдите снова.", 401);
    }

    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            headers.set("Authorization", `Bearer ${newToken}`);
            resolve(
              apiFetch<T>(url, {
                ...options,
                headers,
              }),
            );
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(resolveApiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!refreshRes.ok) {
        throw new Error("Не удалось обновить токен");
      }

      const newTokens = (await refreshRes.json()) as {
        access_token: string;
        refresh_token: string;
      };

      const tokenPair: TokenPair = {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
      };

      tokenStorage.setTokens(tokenPair);
      processQueue(null, tokenPair.accessToken);

      headers.set("Authorization", `Bearer ${tokenPair.accessToken}`);
      return apiFetch<T>(url, {
        ...options,
        headers,
      });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      tokenStorage.clear();
      throw new ApiError("Сессия истекла. Пожалуйста, войдите снова.", 401);
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    let errorMessage = `Ошибка запроса (${response.status})`;
    let details: unknown = null;

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      details = errorData;
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
        errorMessage = errorData.detail.map((d) => d.msg).join(", ");
      } else if (typeof errorData.detail === "object" && errorData.detail !== null) {
        const detailRecord = errorData.detail as Record<string, unknown>;
        if (typeof detailRecord.message === "string") {
          errorMessage = detailRecord.message;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status, details);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}
