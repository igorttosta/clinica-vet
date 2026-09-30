import type { ProfessionalProfile } from "shared-types";
import { apiClient } from "./base";

export const professionalsApi = {
  list: () => apiClient.get<ProfessionalProfile[]>("/professionals"),
};
