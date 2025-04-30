import { z } from "zod";

import { statusEnum } from "~/server/schema";
import { priorityEnum } from "~/server/schema";

export const taskListSchema = z.object({
  limit: z.number().positive(),
  currentPage: z.number().min(0),
});

export const taskIdSchema = z.object({
  taskId: z.string().min(1, "L'identifiant de la tâche est requis"),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.coerce.date().optional(),
  status: z.enum(statusEnum.enumValues),
  priority: z.enum(priorityEnum.enumValues),
  assignees: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1, "L'identifiant de la tâche est requis"),
  ...createTaskSchema.shape,
});

export const deleteTaskSchema = z.object({
  id: z.string().min(1, "L'identifiant de la tâche est requis"),
});

export const TASK_ERRORS = {
  INVALID_FORM: "Données de formulaire invalides",
  FETCH: "Erreur lors de la récupération des tâches",
  CREATE: "Erreur lors de la création de la tâche",
  UPDATE: "Erreur lors de la modification de la tâche",
  DELETE: "Erreur lors de la suppression de la tâche",
  MEMBER_ADD: "Erreur lors de l'ajout d'un membre à la tâche",
  MEMBER_UPDATE: "Erreur lors de la modification du membre",
  MEMBER_REMOVE: "Erreur lors de la suppression du membre",
} as const;
