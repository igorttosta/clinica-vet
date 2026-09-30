"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ADMIN_NAVIGATION } from "@/lib/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/useSidebarStore";

const DESKTOP_WIDTH_OPEN = 240;
const DESKTOP_WIDTH_COLLAPSED = 64;
const MOBILE_DRAWER_WIDTH = 260;

export default function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);
  const isMobileDrawerOpen = useSidebarStore((s) => s.isMobileDrawerOpen);
  const closeMobileDrawer = useSidebarStore((s) => s.closeMobileDrawer);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const items = ADMIN_NAVIGATION.filter((item) => role && item.roles.includes(role));
  const showLabels = isDesktop ? isSidebarOpen : true;

  const list = (
    <List sx={{ width: isDesktop ? "100%" : MOBILE_DRAWER_WIDTH }}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Tooltip
            key={item.href}
            title={!showLabels ? item.title : ""}
            placement="right"
          >
            <ListItemButton
              component={Link}
              href={item.href}
              selected={isActive}
              onClick={isDesktop ? undefined : closeMobileDrawer}
            >
              <ListItemIcon className="min-w-0 mr-2">{item.icon}</ListItemIcon>
              {showLabels && <ListItemText primary={item.title} />}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );

  if (isDesktop) {
    return (
      <Box
        component="aside"
        className="h-full shrink-0 overflow-y-auto border-r border-black/10 bg-white transition-all duration-300"
        sx={{ width: isSidebarOpen ? DESKTOP_WIDTH_OPEN : DESKTOP_WIDTH_COLLAPSED }}
      >
        {list}
      </Box>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={isMobileDrawerOpen}
      onClose={closeMobileDrawer}
      ModalProps={{ keepMounted: true }}
    >
      {list}
    </Drawer>
  );
}
