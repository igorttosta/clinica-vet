"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { AuthUser, Role } from "shared-types";
import { RequireRole } from "@/components/admin/RequireRole";
import { ErrorState } from "@/components/admin/ErrorState";
import { AccountStatusChip } from "@/components/admin/AccountStatusChip";
import { ConfirmWithPasswordDialog } from "@/components/admin/ConfirmWithPasswordDialog";
import { useUsersList } from "@/hooks/useUsersList";
import { useUpdateUserRole } from "@/hooks/useUpdateUserRole";
import { useAuthStore } from "@/store/authStore";
import { formatCpf } from "@/lib/masks";

const ROLE_OPTIONS: Role[] = [
  "ADMIN",
  "VETERINARIO",
  "ATENDENTE",
  "BANHO_TOSA",
  "CLIENTE",
];

export default function UsuariosPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      <UsuariosList />
    </RequireRole>
  );
}

function UsuariosList() {
  const { data, isLoading, isError, refetch } = useUsersList();
  const currentUser = useAuthStore((s) => s.user);
  const updateRole = useUpdateUserRole();

  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [newRole, setNewRole] = useState<Role>("CLIENTE");

  const openEditor = (user: AuthUser) => {
    setEditingUser(user);
    setNewRole(user.role);
    updateRole.reset();
  };

  const handleConfirm = (password: string) => {
    if (!editingUser || !currentUser) return;
    updateRole.mutate(
      {
        id: editingUser.id,
        actingUserId: currentUser.id,
        role: newRole,
        confirmPassword: password,
      },
      { onSuccess: () => setEditingUser(null) }
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Usuários
      </Typography>

      {isLoading && (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <ErrorState message="Erro ao carregar usuários." onRetry={() => refetch()} />
      )}

      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const chip = (
                  <Chip
                    label={u.role}
                    size="small"
                    onClick={isSelf ? undefined : () => openEditor(u)}
                    className={isSelf ? "" : "cursor-pointer"}
                  />
                );
                return (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{formatCpf(u.cpf)}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {isSelf ? (
                        <Tooltip title="Você não pode alterar seu próprio perfil">
                          {chip}
                        </Tooltip>
                      ) : (
                        chip
                      )}
                    </TableCell>
                    <TableCell>
                      <AccountStatusChip status={u.accountStatus} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmWithPasswordDialog
        open={!!editingUser}
        title="Alterar perfil"
        description={`Você está prestes a mudar o perfil de ${editingUser?.name}.`}
        confirmLabel="Salvar"
        isPending={updateRole.isPending}
        errorMessage={
          updateRole.isError && updateRole.error instanceof Error
            ? updateRole.error.message
            : null
        }
        onConfirm={handleConfirm}
        onClose={() => setEditingUser(null)}
      >
        <TextField
          select
          label="Novo perfil"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as Role)}
          fullWidth
        >
          {ROLE_OPTIONS.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </ConfirmWithPasswordDialog>
    </Box>
  );
}
