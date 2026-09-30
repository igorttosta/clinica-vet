"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";

export function useUsersList() {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });
}
