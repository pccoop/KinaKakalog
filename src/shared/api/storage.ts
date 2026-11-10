import { siteConfig } from "@/config/site.config";
import type { TokenPair } from "./types";

const ACCESS_KEY = `${siteConfig.storageKey}:access_token`;
const REFRESH_KEY = `${siteConfig.storageKey}:refresh_token`;

export const tokenStorage = {
  getTokens(): TokenPair | null {
    try {
      const accessToken = localStorage.getItem(ACCESS_KEY);
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!accessToken) return null;
      return {
        accessToken,
        refreshToken: refreshToken || "",
      };
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  setTokens(tokens: TokenPair): void {
    try {
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
      }
    } catch (e) {
      console.error("Failed to save auth tokens:", e);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch (e) {
      console.error("Failed to clear auth tokens:", e);
    }
  },
};
