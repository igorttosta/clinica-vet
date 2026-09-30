"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserRoleInput } from "shared-types";
import { usersApi } from "@/lib/api/users";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateUserRoleInput) =>
      usersApi.updateRole(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
