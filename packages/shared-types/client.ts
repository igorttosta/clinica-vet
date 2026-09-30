import type { Address, AuthUser } from "./auth";

export type ClientInactivationType = "VOLUNTARIO" | "BLOQUEADO";

export interface Client {
  id: string;
  userId: string;
  nextPetNumber: number;
  notes: string | null;
  inactivationType: ClientInactivationType | null;
  blockedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile extends Client {
  user: AuthUser;
}

export interface CreateClientInput {
  name: string;
  email: string;
  cpf: string;
  birthDate?: string;
  phone?: string;
  address?: Partial<Address>;
  notes?: string;
}

export interface UpdateClientStatusInput {
  actingUserId: string;
  status: "ATIVO" | "BLOQUEADO";
  reason?: string;
  confirmPassword: string;
}
