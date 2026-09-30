"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Olá, {user?.name}
      </Typography>
      <Typography color="text.secondary">
        Perfil: {user?.role}. Use o menu ao lado para navegar pelos módulos
        liberados para o seu perfil.
      </Typography>
    </Box>
  );
}
