"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateClientStatusInput } from "shared-types";
import { clientsApi } from "@/lib/api/clients";

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateClientStatusInput) =>
      clientsApi.updateStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
}
