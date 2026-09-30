"use client";

import type { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import type { Role } from "shared-types";
import { useAuthStore } from "@/store/authStore";

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const role = useAuthStore((s) => s.user?.role);

  if (!role || !roles.includes(role)) {
    return (
      <Alert severity="warning">
        Seu perfil não tem acesso a essa área.
      </Alert>
    );
  }

  return <>{children}</>;
}
