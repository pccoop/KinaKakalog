export type UserRole = "Администратор" | "Пользователь";

export interface User {
  id: string;
  login: string;
  name: string;
  email?: string | null;
  role: UserRole | string;
  isBlocked: boolean;
  blockedUntil?: string | null;
  failedAttempts: number;
  createdAt?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
  captchaVerified: boolean;
}

export interface RegisterData {
  login: string;
  name: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface AdminCreateUserData {
  login: string;
  name: string;
  password: string;
  role: string;
}

export interface AdminUpdateUserData {
  name?: string;
  role?: string;
  is_blocked?: boolean;
  password?: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  changePassword(oldPassword: string, newPassword: string): Promise<string>;

  getAllUsers(): Promise<User[]>;
  adminCreateUser(data: AdminCreateUserData): Promise<User>;
  adminUpdateUser(userId: string | number, data: AdminUpdateUserData): Promise<User>;
  adminUnblockUser(userId: string | number): Promise<string>;
}
