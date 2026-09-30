import type { ReactNode } from "react";
import type { Role } from "shared-types";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";

export interface AdminNavItem {
  href: string;
  title: string;
  icon: ReactNode;
  roles: Role[];
}

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    href: "/admin",
    title: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    roles: ["ADMIN", "VETERINARIO", "ATENDENTE", "BANHO_TOSA"],
  },
  {
    href: "/admin/agenda",
    title: "Agenda",
    icon: <EventIcon fontSize="small" />,
    roles: ["ADMIN", "VETERINARIO", "ATENDENTE", "BANHO_TOSA"],
  },
  {
    href: "/admin/clientes",
    title: "Clientes",
    icon: <PeopleIcon fontSize="small" />,
    roles: ["ADMIN", "ATENDENTE"],
  },
  {
    href: "/admin/pets",
    title: "Pets",
    icon: <PetsIcon fontSize="small" />,
    roles: ["ADMIN", "ATENDENTE", "VETERINARIO"],
  },
  {
    href: "/admin/profissionais",
    title: "Profissionais",
    icon: <BadgeIcon fontSize="small" />,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/usuarios",
    title: "Usuários",
    icon: <GroupIcon fontSize="small" />,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/configuracoes",
    title: "Configurações",
    icon: <SettingsIcon fontSize="small" />,
    roles: ["ADMIN"],
  },
];
