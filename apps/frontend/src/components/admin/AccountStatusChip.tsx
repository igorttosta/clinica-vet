"use client";

import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import type { AccountStatus, ClientInactivationType } from "shared-types";

interface Props {
  status: AccountStatus;
  clientInactivation?: { type: ClientInactivationType; reason: string | null } | null;
}

export function AccountStatusChip({ status, clientInactivation }: Props) {
  if (status === "PENDENTE_ATIVACAO") {
    return <Chip label="Ativação pendente" size="small" color="warning" />;
  }

  if (status === "ATIVO") {
    return <Chip label="Ativo" size="small" color="success" />;
  }

  if (clientInactivation?.type === "BLOQUEADO") {
    const chip = <Chip label="Bloqueado" size="small" color="error" />;
    return clientInactivation.reason ? (
      <Tooltip title={clientInactivation.reason}>{chip}</Tooltip>
    ) : (
      chip
    );
  }

  if (clientInactivation?.type === "VOLUNTARIO") {
    return <Chip label="Inativo (opção do cliente)" size="small" />;
  }

  return <Chip label="Inativo" size="small" />;
}
