"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
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
import Typography from "@mui/material/Typography";
import type { ClientProfile } from "shared-types";
import { useClients } from "@/hooks/useClients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUpdateClientStatus } from "@/hooks/useUpdateClientStatus";
import { useAuthStore } from "@/store/authStore";
import { RequireRole } from "@/components/admin/RequireRole";
import { ErrorState } from "@/components/admin/ErrorState";
import { AccountStatusChip } from "@/components/admin/AccountStatusChip";
import { ConfirmWithPasswordDialog } from "@/components/admin/ConfirmWithPasswordDialog";

export default function ClientesPage() {
  return (
    <RequireRole roles={["ADMIN", "ATENDENTE"]}>
      <ClientesList />
    </RequireRole>
  );
}

function ClientesList() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isFetching, isError, refetch } = useClients(debouncedSearch);

  const currentUser = useAuthStore((s) => s.user);
  const updateStatus = useUpdateClientStatus();

  const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);
  const [newStatus, setNewStatus] = useState<"ATIVO" | "BLOQUEADO">("ATIVO");
  const [reason, setReason] = useState("");

  const openEditor = (client: ClientProfile) => {
    setEditingClient(client);
    setNewStatus(client.user.accountStatus === "ATIVO" ? "BLOQUEADO" : "ATIVO");
    setReason(client.blockedReason ?? "");
    updateStatus.reset();
  };

  const handleConfirm = (password: string) => {
    if (!editingClient || !currentUser) return;
    updateStatus.mutate(
      {
        id: editingClient.id,
        actingUserId: currentUser.id,
        status: newStatus,
        reason: newStatus === "BLOQUEADO" ? reason : undefined,
        confirmPassword: password,
      },
      { onSuccess: () => setEditingClient(null) }
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Clientes
      </Typography>

      <Box className="mb-6 flex w-80 items-center gap-2">
        <TextField
          label="Buscar por nome ou CPF"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
        />
        {isFetching && !isPending && <CircularProgress size={20} />}
      </Box>

      {isPending && (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <ErrorState message="Erro ao carregar clientes." onRetry={() => refetch()} />
      )}

      {data && data.items.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.user.name}</TableCell>
                  <TableCell>{client.user.cpf}</TableCell>
                  <TableCell>{client.user.email}</TableCell>
                  <TableCell>{client.user.address.city ?? "—"}</TableCell>
                  <TableCell>
                    <Box
                      onClick={() => openEditor(client)}
                      className="inline-block cursor-pointer"
                    >
                      <AccountStatusChip
                        status={client.user.accountStatus}
                        clientInactivation={
                          client.inactivationType
                            ? { type: client.inactivationType, reason: client.blockedReason }
                            : null
                        }
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {data && data.items.length === 0 && (
        <Typography color="text.secondary">
          Nenhum cliente encontrado.
        </Typography>
      )}

      <ConfirmWithPasswordDialog
        open={!!editingClient}
        title="Alterar status do cliente"
        description={`Você está prestes a alterar o status de ${editingClient?.user.name}.`}
        confirmLabel="Salvar"
        isPending={updateStatus.isPending}
        errorMessage={
          updateStatus.isError && updateStatus.error instanceof Error
            ? updateStatus.error.message
            : null
        }
        onConfirm={handleConfirm}
        onClose={() => setEditingClient(null)}
      >
        <TextField
          select
          label="Novo status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as "ATIVO" | "BLOQUEADO")}
          fullWidth
        >
          <MenuItem value="ATIVO">Ativo</MenuItem>
          <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
        </TextField>
        {newStatus === "BLOQUEADO" && (
          <TextField
            label="Motivo do bloqueio"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            multiline
            minRows={2}
            fullWidth
          />
        )}
      </ConfirmWithPasswordDialog>
    </Box>
  );
}
