"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PetsIcon from "@mui/icons-material/Pets";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";

const services = [
  {
    icon: <EventAvailableIcon fontSize="large" color="primary" />,
    title: "Consultas",
    description: "Atendimento clínico completo com nossos veterinários.",
  },
  {
    icon: <PetsIcon fontSize="large" color="primary" />,
    title: "Banho e tosa",
    description: "Cuidado e bem-estar para o seu pet ficar sempre em dia.",
  },
  {
    icon: <VaccinesIcon fontSize="large" color="primary" />,
    title: "Vacinação",
    description: "Carteira de vacinação digital, sempre disponível para você.",
  },
  {
    icon: <ScienceIcon fontSize="large" color="primary" />,
    title: "Exames",
    description: "Solicitação e resultados acompanhados pela área do cliente.",
  },
];

export default function Home() {
  return (
    <Box className="min-h-screen">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar className="justify-between gap-2">
          <Typography
            variant="h6"
            component="span"
            color="primary"
            noWrap
            sx={{ fontWeight: 700, fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Clínica Veterinária
          </Typography>
          <Box className="flex shrink-0 gap-1 sm:gap-2">
            <Button
              component={Link}
              href="/login"
              color="inherit"
              size="small"
              sx={{ whiteSpace: "nowrap" }}
            >
              Entrar
            </Button>
            <Button
              component={Link}
              href="/cadastro"
              variant="contained"
              size="small"
              sx={{ whiteSpace: "nowrap" }}
            >
              Cadastrar
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="flex flex-col items-center gap-4 py-16 text-center">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Cuidado completo para o seu pet
        </Typography>
        <Typography variant="h6" color="text.secondary" className="max-w-xl">
          Agende consultas, acompanhe o prontuário e a carteira de vacinação
          do seu pet num só lugar.
        </Typography>
        <Box className="flex gap-3 pt-2">
          <Button component={Link} href="/cadastro" variant="contained" size="large">
            Criar minha conta
          </Button>
          <Button component={Link} href="/login" variant="outlined" size="large">
            Já sou cliente
          </Button>
        </Box>
      </Container>

      <Container maxWidth="md" className="pb-16">
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6 }}>
              <Paper className="flex h-full flex-col items-start gap-2 p-4" variant="outlined">
                {service.icon}
                <Typography variant="h6" component="h2">
                  {service.title}
                </Typography>
                <Typography color="text.secondary">{service.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
