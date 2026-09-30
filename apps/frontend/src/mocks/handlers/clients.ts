import { http, HttpResponse, delay } from "msw";
import type {
  Client,
  ClientProfile,
  CreateClientInput,
  Paginated,
  UpdateClientStatusInput,
} from "shared-types";
import { mockClients } from "../data/clients";
import { mockCredentials } from "../data/credentials";

let clients = [...mockClients];

function toProfile(client: Client): ClientProfile | undefined {
  const credential = mockCredentials.find((c) => c.id === client.userId);
  if (!credential) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = credential;
  return { ...client, user };
}

export const clientHandlers = [
  http.get("/api/clients", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();

    const profiles = clients
      .map(toProfile)
      .filter((p): p is ClientProfile => p !== undefined);

    const filtered = search
      ? profiles.filter(
          (p) =>
            p.user.name.toLowerCase().includes(search) ||
            p.user.cpf.includes(search)
        )
      : profiles;

    const body: Paginated<ClientProfile> = {
      items: filtered,
      total: filtered.length,
      page: 1,
      pageSize: filtered.length,
    };
    return HttpResponse.json(body);
  }),

  http.get("/api/clients/:id", async ({ params }) => {
    await delay(200);
    const client = clients.find((c) => c.id === params.id);
    const profile = client ? toProfile(client) : undefined;
    if (!profile) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(profile);
  }),

  http.post("/api/clients", async ({ request }) => {
    await delay(300);
    const data = (await request.json()) as CreateClientInput;
    const now = new Date().toISOString();

    const userId = crypto.randomUUID();
    mockCredentials.push({
      id: userId,
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      birthDate: data.birthDate ?? null,
      phone: data.phone ?? null,
      address: {
        zipCode: data.address?.zipCode ?? null,
        street: data.address?.street ?? null,
        number: data.address?.number ?? null,
        complement: data.address?.complement ?? null,
        neighborhood: data.address?.neighborhood ?? null,
        city: data.address?.city ?? null,
        state: data.address?.state ?? null,
      },
      role: "CLIENTE",
      accountStatus: "PENDENTE_ATIVACAO",
      createdAt: now,
      updatedAt: now,
      password: "123456", // mock: senha real só é definida depois, via e-mail de ativação
    });

    const newClient: Client = {
      id: crypto.randomUUID(),
      userId,
      nextPetNumber: 1,
      notes: data.notes ?? null,
      inactivationType: null,
      blockedReason: null,
      createdAt: now,
      updatedAt: now,
    };
    clients = [...clients, newClient];

    const profile = toProfile(newClient);
    return HttpResponse.json(profile, { status: 201 });
  }),

  http.patch("/api/clients/:id/status", async ({ request, params }) => {
    await delay(300);
    const { actingUserId, status, reason, confirmPassword } =
      (await request.json()) as UpdateClientStatusInput;

    const actingUser = mockCredentials.find((c) => c.id === actingUserId);
    if (!actingUser || actingUser.password !== confirmPassword) {
      return HttpResponse.json({ message: "Senha incorreta." }, { status: 401 });
    }
    if (actingUser.role !== "ADMIN" && actingUser.role !== "ATENDENTE") {
      return HttpResponse.json(
        { message: "Seu perfil não pode alterar o status de clientes." },
        { status: 403 }
      );
    }

    const client = clients.find((c) => c.id === params.id);
    if (!client) return new HttpResponse(null, { status: 404 });
    const targetUser = mockCredentials.find((c) => c.id === client.userId);
    if (!targetUser) return new HttpResponse(null, { status: 404 });

    if (status === "BLOQUEADO") {
      if (!reason?.trim()) {
        return HttpResponse.json(
          { message: "Informe o motivo do bloqueio." },
          { status: 400 }
        );
      }
      client.inactivationType = "BLOQUEADO";
      client.blockedReason = reason.trim();
      targetUser.accountStatus = "INATIVO";
    } else {
      client.inactivationType = null;
      client.blockedReason = null;
      targetUser.accountStatus = "ATIVO";
    }

    const now = new Date().toISOString();
    client.updatedAt = now;
    targetUser.updatedAt = now;

    const profile = toProfile(client);
    return HttpResponse.json(profile);
  }),
];
