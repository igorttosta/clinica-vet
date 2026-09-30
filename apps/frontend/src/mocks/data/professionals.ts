import type { Professional } from "shared-types";

export const mockProfessionals: Professional[] = [
  {
    id: "prof-0001",
    userId: "u-vet-0001",
    type: "VETERINARIO",
    crmv: "SP-12345",
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-06-01T09:00:00Z",
  },
  {
    id: "prof-0002",
    userId: "u-banhotosa-0001",
    type: "BANHISTA",
    crmv: null,
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-06-01T09:00:00Z",
  },
  {
    id: "prof-0003",
    userId: "u-banhotosa-0002",
    type: "TOSADOR",
    crmv: null,
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
  },
];
