"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useAuthStore } from "@/store/authStore";
import { canAccessAdminArea } from "@/lib/permissions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const role = useAuthStore((s) => s.user?.role);
  const router = useRouter();
  const allowed = canAccessAdminArea(role);

  useEffect(() => {
    if (hasHydrated && !allowed) {
      router.replace("/login");
    }
  }, [hasHydrated, allowed, router]);

  if (!hasHydrated || !allowed) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="flex h-screen flex-col">
      <Topbar />
      <Box className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Box component="main" className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
