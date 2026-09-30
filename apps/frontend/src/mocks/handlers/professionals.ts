import { http, HttpResponse, delay } from "msw";
import type { ProfessionalProfile } from "shared-types";
import { mockProfessionals } from "../data/professionals";
import { mockCredentials } from "../data/credentials";

export const professionalHandlers = [
  http.get("/api/professionals", async () => {
    await delay(300);

    const profiles = mockProfessionals
      .map((professional) => {
        const credential = mockCredentials.find((c) => c.id === professional.userId);
        if (!credential) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...user } = credential;
        return { ...professional, user };
      })
      .filter((p): p is ProfessionalProfile => p !== undefined);

    return HttpResponse.json(profiles);
  }),
];
