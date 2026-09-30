import type { Role } from "shared-types";

export const ADMIN_AREA_ROLES: Role[] = [
  "ADMIN",
  "VETERINARIO",
  "ATENDENTE",
  "BANHO_TOSA",
];

export function canAccessAdminArea(role: Role | undefined): boolean {
  return !!role && ADMIN_AREA_ROLES.includes(role);
}
