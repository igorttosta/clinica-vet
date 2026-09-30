import type { AuthUser, UpdateUserRoleInput } from "shared-types";
import { apiClient } from "./base";

export const usersApi = {
  list: () => apiClient.get<AuthUser[]>("/users"),
  updateRole: (id: string, data: UpdateUserRoleInput) =>
    apiClient.patch<AuthUser>(`/users/${id}/role`, data),
};
