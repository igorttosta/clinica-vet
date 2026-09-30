import { http, HttpResponse, delay } from "msw";
import type { AuthUser, UpdateUserRoleInput } from "shared-types";
import { mockCredentials } from "../data/credentials";

export const userHandlers = [
  http.get("/api/users", async () => {
    await delay(300);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const users: AuthUser[] = mockCredentials.map(({ password: _password, ...user }) => user);
    return HttpResponse.json(users);
  }),

  http.patch("/api/users/:id/role", async ({ request, params }) => {
    await delay(300);
    const { actingUserId, role, confirmPassword } =
      (await request.json()) as UpdateUserRoleInput;

    const actingUser = mockCredentials.find((c) => c.id === actingUserId);
    if (!actingUser || actingUser.password !== confirmPassword) {
      return HttpResponse.json({ message: "Senha incorreta." }, { status: 401 });
    }
    if (actingUser.role !== "ADMIN") {
      return HttpResponse.json(
        { message: "Só administradores podem alterar perfis." },
        { status: 403 }
      );
    }
    if (actingUser.id === params.id) {
      return HttpResponse.json(
        { message: "Você não pode alterar seu próprio perfil por aqui." },
        { status: 400 }
      );
    }

    const target = mockCredentials.find((c) => c.id === params.id);
    if (!target) return new HttpResponse(null, { status: 404 });

    target.role = role;
    target.updatedAt = new Date().toISOString();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...user } = target;
    return HttpResponse.json(user);
  }),
];
