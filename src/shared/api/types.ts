export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TemporaryLockoutInfo {
  message?: string;
  code?: string;
  is_temporary?: boolean;
  remaining_seconds?: number;
  blocked_until?: string;
}

export interface ApiErrorResponse {
  detail?: string | Array<{ msg: string; loc?: string[] }> | TemporaryLockoutInfo;
  message?: string;
}

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
