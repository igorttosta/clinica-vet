"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { clientsApi } from "@/lib/api/clients";

export function useClients(search?: string) {
  return useQuery({
    queryKey: ["clients", search],
    queryFn: () => clientsApi.list({ search }),
    placeholderData: keepPreviousData,
  });
}
