import type {
  ClientProfile,
  CreateClientInput,
  Paginated,
  UpdateClientStatusInput,
} from "shared-types";
import { apiClient } from "./base";

export const clientsApi = {
  list: (params?: { search?: string; page?: number }) =>
    apiClient.get<Paginated<ClientProfile>>("/clients", { params }),
  getById: (id: string) => apiClient.get<ClientProfile>(`/clients/${id}`),
  create: (data: CreateClientInput) =>
    apiClient.post<ClientProfile>("/clients", data),
  updateStatus: (id: string, data: UpdateClientStatusInput) =>
    apiClient.patch<ClientProfile>(`/clients/${id}/status`, data),
};
