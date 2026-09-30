"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { CreateClientInput } from "shared-types";
import { clientsApi } from "@/lib/api/clients";
import { formatCpf, formatPhone, onlyDigits } from "@/lib/masks";
import { useActivateAccount } from "@/hooks/useActivateAccount";

const emptyForm: CreateClientInput = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
};

export default function CadastroPage() {
  const [form, setForm] = useState<CreateClientInput>(emptyForm);
  const router = useRouter();

  const register = useMutation({
    mutationFn: (data: CreateClientInput) => clientsApi.create(data),
  });

  const activate = useActivateAccount();

  const handleChange =
    (field: keyof CreateClientInput) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleDigitsChange =
    (field: "cpf" | "phone", maxLength: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const digits = onlyDigits(event.target.value).slice(0, maxLength);
      setForm((prev) => ({ ...prev, [field]: digits }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    register.mutate(form);
  };

  if (register.isSuccess) {
    return (
      <Container
        maxWidth="xs"
        className="flex min-h-screen flex-col justify-center gap-4 py-12 text-center"
      >
        <Typography variant="h5" component="h1">
          Conta criada!
        </Typography>
        <Typography color="text.secondary">
          Enviamos um e-mail para <strong>{form.email}</strong> com o link de
          ativação. Defina sua senha por lá para poder entrar.
        </Typography>
        <Button component={Link} href="/login" variant="contained">
          Ir para o login
        </Button>

        <Divider className="my-2" />

        <Typography variant="caption" color="text.secondary">
          Não existe e-mail de verdade nesse ambiente de teste. Use o botão
          abaixo para simular o clique no link de ativação.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          loading={activate.isPending}
          onClick={() =>
            activate.mutate(
              { email: form.email },
              { onSuccess: () => router.push("/") }
            )
          }
        >
          Simular ativação (dev)
        </Button>
        {activate.isError && (
          <Alert severity="error">Não foi possível ativar a conta.</Alert>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" className="flex min-h-screen flex-col justify-center gap-6 py-12">
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          Criar conta
        </Typography>
        <Typography color="text.secondary">
          Cadastre-se como tutor para agendar consultas e acompanhar seus pets.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Nome completo"
          value={form.name}
          onChange={handleChange("name")}
          required
          fullWidth
        />
        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          fullWidth
        />
        <TextField
          label="CPF"
          value={formatCpf(form.cpf)}
          onChange={handleDigitsChange("cpf", 11)}
          required
          fullWidth
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
          helperText="Somente números"
        />
        <TextField
          label="Telefone"
          value={formatPhone(form.phone ?? "")}
          onChange={handleDigitsChange("phone", 11)}
          fullWidth
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
        />

        {register.isError && (
          <Alert severity="error">Não foi possível concluir o cadastro.</Alert>
        )}

        <Button type="submit" variant="contained" size="large" loading={register.isPending}>
          Criar conta
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium underline">
          Entrar
        </Link>
      </Typography>
    </Container>
  );
}
