import { z } from "zod";

export const createTeamSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
  name: z.string().min(1, "Le nom de l'équipe est requis"),
});

export const updateTeamSchema = z.object({
  teamId: z.string().min(1, "L'identifiant de l'équipe est requis"),
  name: z.string().min(1, "Le nom de l'équipe est requis"),
});

export const TEAM_ERRORS = {
  CREATE: "Erreur lors de l'ajout d'une équipe à l'organisation",
  UPDATE: "Erreur lors de la modification de l'équipe",
  INVALID_FORM: "Données de formulaire invalides",
} as const;
