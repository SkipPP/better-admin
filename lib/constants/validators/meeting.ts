import { z } from "zod";

export const meetingListSchema = z.object({
  limit: z.number().positive(),
  currentPage: z.number().min(0),
});

export const meetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  teamId: z.string().nullish().optional(),
  members: z.array(z.string()).optional(),
});

export const MEETING_ERRORS = {
  INVALID_FORM: "Données de formulaire invalides",
  FETCH: "Erreur lors de la récupération des meetings",
  CREATE: "Erreur lors de la création du meeting",
  UPDATE: "Erreur lors de la modification du meeting",
  DELETE: "Erreur lors de la suppression du meeting",
  MEMBER_ADD: "Erreur lors de l'ajout d'un membre au meeting",
  MEMBER_UPDATE: "Erreur lors de la modification du membre",
  MEMBER_REMOVE: "Erreur lors de la suppression du membre",
} as const;
