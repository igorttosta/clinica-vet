"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { InactiveAccountError } from "shared-types";
import { ApiError } from "@/lib/api/base";
import { useLogin } from "@/hooks/useLogin";
import { useReactivateAccount } from "@/hooks/useReactivateAccount";
import { testLoginCredentials } from "@/mocks/data/credentials";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = useLogin();
  const reactivate = useReactivateAccount();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          router.push(data.user.role === "CLIENTE" ? "/" : "/admin");
        },
      }
    );
  };

  const handleReactivate = () => {
    reactivate.mutate(
      { email, password },
      { onSuccess: () => router.push("/") }
    );
  };

  const inactiveError =
    login.error instanceof ApiError &&
    login.error.status === 403 &&
    (login.error.body as InactiveAccountError | undefined)?.reactivatable
      ? (login.error.body as InactiveAccountError)
      : null;

  return (
    <Container maxWidth="xs" className="flex min-h-screen flex-col justify-center gap-6 py-12">
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          Entrar
        </Typography>
        <Typography color="text.secondary">
          Acesse sua conta da Clínica Veterinária.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />

        {inactiveError ? (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleReactivate}
                loading={reactivate.isPending}
              >
                Reativar conta
              </Button>
            }
          >
            {inactiveError.message} Deseja reativá-la?
          </Alert>
        ) : (
          login.isError && (
            <Alert severity="error">
              {login.error instanceof Error
                ? login.error.message
                : "Não foi possível entrar."}
            </Alert>
          )
        )}

        {reactivate.isError && (
          <Alert severity="error">
            {reactivate.error instanceof Error
              ? reactivate.error.message
              : "Não foi possível reativar a conta."}
          </Alert>
        )}

        <Button type="submit" variant="contained" size="large" loading={login.isPending}>
          Entrar
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-medium underline">
          Cadastre-se
        </Link>
      </Typography>

      <Alert severity="info">
        <Typography variant="caption" component="div">
          <strong>Login de teste</strong> (senha <code>123456</code> para todos):
        </Typography>
        {testLoginCredentials.map((c) => (
          <Typography key={c.id} variant="caption" component="div">
            {c.role}: {c.email}
          </Typography>
        ))}
        <Typography variant="caption" component="div" className="mt-1">
          Contas inativas de teste: camila.duarte@clinicavet.com.br (equipe,
          reativada só pelo admin), joao.martins@example.com (cliente que saiu
          por conta própria, pode se reativar) e roberto.almeida@example.com
          (cliente bloqueado, não pode se reativar).
          Cadastre-se para testar a ativação pendente por e-mail.
        </Typography>
      </Alert>
    </Container>
  );
}
