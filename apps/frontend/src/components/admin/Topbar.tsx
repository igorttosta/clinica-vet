"use client";

import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function Topbar() {
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const toggleMobileDrawer = useSidebarStore((s) => s.toggleMobileDrawer);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <IconButton
            onClick={isDesktop ? toggleSidebar : toggleMobileDrawer}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="span"
            noWrap
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Clínica Veterinária
          </Typography>
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right", lineHeight: 1.2 }}>
              <Typography variant="body2">{user.name}</Typography>
            </Box>
            <Chip label={user.role} size="small" color="secondary" />
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Sair
            </Button>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              aria-label="Sair"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
