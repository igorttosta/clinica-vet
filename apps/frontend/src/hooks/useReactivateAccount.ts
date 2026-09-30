"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useReactivateAccount() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: authApi.reactivate,
    onSuccess: (data) => setSession(data.user, data.accessToken),
  });
}
