const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

interface RequestOptions {
  params?: Record<string, string | number | undefined>;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options?: RequestOptions & { body?: unknown }
): Promise<T> {
  const res = await fetch(buildUrl(path, options?.params), {
    method,
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const raw = await res.text();
    let message = `Não foi possível completar a requisição (erro ${res.status}).`;
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(raw);
      if (parsedBody && typeof (parsedBody as { message?: unknown }).message === "string") {
        message = (parsedBody as { message: string }).message;
      }
    } catch {
      // resposta sem JSON: mantém a mensagem genérica
    }
    throw new ApiError(res.status, message, parsedBody);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, { body }),
  patch: <T>(path: string, body: unknown) =>
    request<T>("PATCH", path, { body }),
};
