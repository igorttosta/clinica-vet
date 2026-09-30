import { http, HttpResponse, delay } from "msw";
import type {
  ActivateAccountInput,
  AuthUser,
  InactiveAccountError,
  LoginInput,
  LoginResponse,
} from "shared-types";
import { mockCredentials } from "../data/credentials";
import { mockClients } from "../data/clients";

function findCredential(email: string, password: string) {
  return mockCredentials.find(
    (c) =>
      c.email.toLowerCase() === email.trim().toLowerCase() &&
      c.password === password
  );
}

function findCredentialByEmail(email: string) {
  return mockCredentials.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );
}

function toLoginResponse(match: (typeof mockCredentials)[number]): LoginResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = match;
  return {
    user: user as AuthUser,
    accessToken: `mock-token.${user.id}.${Date.now()}`,
  };
}

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(400);
    const { email, password } = (await request.json()) as LoginInput;
    const match = findCredential(email, password);

    if (!match) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    if (match.accountStatus === "PENDENTE_ATIVACAO") {
      const body: InactiveAccountError = {
        message:
          "Sua conta ainda não foi ativada. Verifique o e-mail que enviamos com o link de ativação.",
        reactivatable: false,
      };
      return HttpResponse.json(body, { status: 403 });
    }

    if (match.accountStatus === "INATIVO") {
      const client = mockClients.find((c) => c.userId === match.id);
      const isVoluntary = match.role === "CLIENTE" && client?.inactivationType === "VOLUNTARIO";

      let message = "Esta conta está inativa. Fale com a administração da clínica.";
      if (isVoluntary) {
        message = "Esta conta está inativa.";
      } else if (client?.inactivationType === "BLOQUEADO") {
        message = `Esta conta foi bloqueada. Motivo: ${client.blockedReason ?? "não informado"}. Fale com a administração da clínica.`;
      }

      const body: InactiveAccountError = { message, reactivatable: isVoluntary };
      return HttpResponse.json(body, { status: 403 });
    }

    return HttpResponse.json(toLoginResponse(match));
  }),

  http.post("/api/auth/reactivate", async ({ request }) => {
    await delay(400);
    const { email, password } = (await request.json()) as LoginInput;
    const match = findCredential(email, password);

    if (!match) {
      return HttpResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 }
      );
    }

    const client = mockClients.find((c) => c.userId === match.id);
    const canSelfReactivate =
      match.accountStatus === "INATIVO" &&
      match.role === "CLIENTE" &&
      client?.inactivationType === "VOLUNTARIO";

    if (!canSelfReactivate) {
      return HttpResponse.json(
        { message: "Essa conta não pode ser reativada por aqui." },
        { status: 403 }
      );
    }

    match.accountStatus = "ATIVO";
    match.updatedAt = new Date().toISOString();
    client!.inactivationType = null;
    client!.blockedReason = null;
    client!.updatedAt = match.updatedAt;

    return HttpResponse.json(toLoginResponse(match));
  }),

  http.post("/api/auth/activate", async ({ request }) => {
    await delay(400);
    const { email } = (await request.json()) as ActivateAccountInput;
    const match = findCredentialByEmail(email);

    if (!match || match.accountStatus !== "PENDENTE_ATIVACAO") {
      return HttpResponse.json(
        { message: "Não há ativação pendente para esse e-mail." },
        { status: 400 }
      );
    }

    match.accountStatus = "ATIVO";
    match.updatedAt = new Date().toISOString();

    return HttpResponse.json(toLoginResponse(match));
  }),
];
