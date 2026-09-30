"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface Props {
  open: boolean;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  isPending: boolean;
  errorMessage?: string | null;
  onConfirm: (password: string) => void;
  onClose: () => void;
}

export function ConfirmWithPasswordDialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirmar",
  isPending,
  errorMessage,
  onConfirm,
  onClose,
}: Props) {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm(password);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <Typography color="text.secondary">{description}</Typography>
          {children}
          <TextField
            label="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" loading={isPending}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
