import { apiFetch } from "@/shared/api/client";
import { tokenStorage } from "@/shared/api/storage";
import type {
  AdminCreateUserData,
  AdminUpdateUserData,
  AuthResponse,
  IAuthService,
  LoginCredentials,
  RegisterData,
  User,
} from "../types";

interface BackendUser {
  id: number;
  login: string;
  name: string;
  email?: string | null;
  role: string;
  is_blocked: boolean;
  blocked_until?: string | null;
  failed_attempts: number;
  created_at: string;
}

interface BackendTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  message: string;
  user: BackendUser;
}

interface BackendMessageResponse {
  message: string;
}

function mapUser(backendUser: BackendUser): User {
  return {
    id: String(backendUser.id),
    login: backendUser.login,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role,
    isBlocked: backendUser.is_blocked,
    blockedUntil: backendUser.blocked_until,
    failedAttempts: backendUser.failed_attempts,
    createdAt: backendUser.created_at,
  };
}

export class FastApiAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiFetch<BackendTokenResponse>("/api/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({
        login: credentials.login,
        password: credentials.password,
        captcha_verified: credentials.captchaVerified,
      }),
    });

    tokenStorage.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    return {
      user: mapUser(data.user),
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      message: data.message,
    };
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const data = await apiFetch<BackendTokenResponse>("/api/auth/register", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({
        login: registerData.login,
        name: registerData.name,
        password: registerData.password,
        email: registerData.email || null,
      }),
    });

    tokenStorage.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    return {
      user: mapUser(data.user),
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      message: data.message,
    };
  }

  async logout(): Promise<void> {
    try {
      await apiFetch<BackendMessageResponse>("/api/auth/logout", {
        method: "POST",
      });
    } catch (e) {
      console.warn("Logout notification failed:", e);
    } finally {
      tokenStorage.clear();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const data = await apiFetch<BackendUser>("/api/auth/me");
      return mapUser(data);
    } catch {
      tokenStorage.clear();
      return null;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<string> {
    const data = await apiFetch<BackendMessageResponse>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    return data.message;
  }

  async getAllUsers(): Promise<User[]> {
    const list = await apiFetch<BackendUser[]>("/api/admin/users");
    return list.map(mapUser);
  }

  async adminCreateUser(data: AdminCreateUserData): Promise<User> {
    const created = await apiFetch<BackendUser>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return mapUser(created);
  }

  async adminUpdateUser(userId: string | number, data: AdminUpdateUserData): Promise<User> {
    const updated = await apiFetch<BackendUser>(`/api/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mapUser(updated);
  }

  async adminUnblockUser(userId: string | number): Promise<string> {
    const res = await apiFetch<BackendMessageResponse>(`/api/admin/users/${userId}/unblock`, {
      method: "POST",
    });
    return res.message;
  }
}
