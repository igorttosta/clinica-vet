import type { ActivateAccountInput, LoginInput, LoginResponse } from "shared-types";
import { apiClient } from "./base";

export const authApi = {
  login: (data: LoginInput) => apiClient.post<LoginResponse>("/auth/login", data),
  reactivate: (data: LoginInput) =>
    apiClient.post<LoginResponse>("/auth/reactivate", data),
  activate: (data: ActivateAccountInput) =>
    apiClient.post<LoginResponse>("/auth/activate", data),
};
