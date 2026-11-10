import type { IAuthService } from "../types";
import { FastApiAuthService } from "./fastapi-auth.service";

export const authService: IAuthService = new FastApiAuthService();
