"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

export function ErrorState({
  message = "Não foi possível carregar os dados.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Tentar novamente
        </Button>
      }
    >
      {message}
    </Alert>
  );
}
