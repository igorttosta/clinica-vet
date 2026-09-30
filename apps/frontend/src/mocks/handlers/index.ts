import { clientHandlers } from "./clients";
import { authHandlers } from "./auth";
import { userHandlers } from "./users";
import { professionalHandlers } from "./professionals";

export const handlers = [
  ...authHandlers,
  ...clientHandlers,
  ...userHandlers,
  ...professionalHandlers,
];
