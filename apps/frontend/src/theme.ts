import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF914D", // laranja acolhedor
    },
    secondary: {
      main: "#A7D397", // verde claro
    },
    background: {
      default: "#FDF7E4", // creme
      paper: "#FFFFFF",
    },
    text: {
      primary: "#3A3A3A",
      secondary: "#6B7280",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
