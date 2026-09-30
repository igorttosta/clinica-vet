import type { AuthUser } from "./auth";

export type ProfessionalType = "VETERINARIO" | "BANHISTA" | "TOSADOR";

export interface Professional {
  id: string;
  userId: string;
  type: ProfessionalType;
  crmv: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalProfile extends Professional {
  user: AuthUser;
}
