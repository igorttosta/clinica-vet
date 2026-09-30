"use client";

import { useEffect, useState } from "react";

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!useMocks);

  useEffect(() => {
    if (!useMocks) return;

    import("@/mocks/browser").then(({ startMockWorker }) => {
      startMockWorker().then(() => setReady(true));
    });
  }, []);

  // Só renderiza depois que o MSW estiver interceptando as requisições.
  if (!ready) return null;

  return <>{children}</>;
}
