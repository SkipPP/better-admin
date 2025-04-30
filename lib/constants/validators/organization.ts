import { z } from "zod";

export const organizationListSchema = z.object({
  limit: z.number().positive(),
  currentPage: z.number().min(0),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Le nom de l'organisation est requis"),
  slug: z.string().min(1, "Le slug de l'organisation est requis"),
  logo: z.string().optional(),
});

export const organizationIdSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
});

export const updateOrganizationSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
  name: z.string().min(1, "Le nom de l'organisation est requis"),
  slug: z.string().min(1, "Le slug de l'organisation est requis"),
  logo: z.string().optional(),
});

export const deleteOrganizationSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
});

export const memberSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  role: z.enum(["member", "admin", "owner"]),
  teamId: z.string().optional(),
  email: z.string().email("L'email est invalide").optional(),
});

export const updateOrganizationMemberRoleSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
  memberId: z.string().min(1, "L'identifiant du membre est requis"),
  role: z.enum(["member", "admin", "owner"]),
  userRole: z.enum(["member", "admin", "owner"]),
  teamId: z.string().optional(),
});

export const removeOrganizationMemberSchema = z.object({
  organizationId: z.string().min(1, "L'identifiant de l'organisation est requis"),
  memberIdOrEmail: z.string().min(1, "L'identifiant du membre est requis"),
});

export const ORGANIZATION_ERRORS = {
  INVALID_FORM: "Données de formulaire invalides",
  FETCH: "Erreur lors de la récupération des organisations",
  CREATE: "Erreur lors de la création de l'organisation",
  UPDATE: "Erreur lors de la modification de l'organisation",
  DELETE: "Erreur lors de la suppression de l'organisation",
  MEMBER_ADD: "Erreur lors de l'ajout d'un membre à l'organisation",
  MEMBER_UPDATE: "Erreur lors de la modification du rôle du membre",
  MEMBER_REMOVE: "Erreur lors de la suppression d'un membre de l'organisation",
} as const;
