"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { RequireRole } from "@/components/admin/RequireRole";
import { ErrorState } from "@/components/admin/ErrorState";
import { AccountStatusChip } from "@/components/admin/AccountStatusChip";
import { useProfessionals } from "@/hooks/useProfessionals";
import { formatPhone } from "@/lib/masks";

export default function ProfissionaisPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      <ProfissionaisList />
    </RequireRole>
  );
}

function ProfissionaisList() {
  const { data, isLoading, isError, refetch } = useProfessionals();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profissionais
      </Typography>

      {isLoading && (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <ErrorState message="Erro ao carregar profissionais." onRetry={() => refetch()} />
      )}

      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>CRMV</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((professional) => (
                <TableRow key={professional.id} hover>
                  <TableCell>{professional.user.name}</TableCell>
                  <TableCell>
                    <Chip label={professional.type} size="small" />
                  </TableCell>
                  <TableCell>{professional.crmv ?? "—"}</TableCell>
                  <TableCell>
                    {professional.user.phone ? formatPhone(professional.user.phone) : "—"}
                  </TableCell>
                  <TableCell>
                    <AccountStatusChip status={professional.user.accountStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
