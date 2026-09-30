import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Evita iniciar o worker duas vezes no Strict Mode.
let startPromise: Promise<unknown> | undefined;

export function startMockWorker() {
  if (!startPromise) {
    startPromise = worker.start({ onUnhandledRequest: "bypass" });
  }
  return startPromise;
}
