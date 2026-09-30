"use client";

import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/professionals";

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: professionalsApi.list,
  });
}
