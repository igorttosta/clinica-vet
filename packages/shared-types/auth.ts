export type Role =
  | "ADMIN"
  | "VETERINARIO"
  | "ATENDENTE"
  | "BANHO_TOSA"
  | "CLIENTE";

export interface Address {
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
}

export type AccountStatus = "PENDENTE_ATIVACAO" | "ATIVO" | "INATIVO";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: string | null;
  phone: string | null;
  address: Address;
  role: Role;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface ActivateAccountInput {
  email: string;
}

export interface InactiveAccountError {
  message: string;
  reactivatable: boolean;
}

export interface UpdateUserRoleInput {
  // Só no mock; na API real vem do JWT.
  actingUserId: string;
  role: Role;
  confirmPassword: string;
}
