import { z } from "zod";

// Validation schemas
export const userListSchema = z.object({
  limit: z.number().positive(),
  currentPage: z.number().min(0),
});

export const userSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Le nom de l'utilisateur est requis"),
  email: z.string().email("L'email est invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["user", "admin", "superadmin"] as const),
});

export const updateUserSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  name: z.string().min(1, "Le nom de l'utilisateur est requis"),
  role: z.enum(["user", "admin", "superadmin"] as const),
});

export const setUserRoleSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  role: z.enum(["user", "admin", "superadmin"] as const),
});

export const banUserSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  banReason: z.string().min(1, "La raison du bannissement est requise"),
  banExpiresIn: z.number().transform((val) => {
    const date = new Date(val);

    if (isNaN(date.getTime())) {
      throw new Error("La date d'expiration du bannissement est invalide");
    }

    return Math.floor((date.getTime() - Date.now()) / 1000);
  }),
});

export const userIdSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
});

export const sessionSchema = z.object({
  userId: z.string(),
  limit: z.number().positive(),
  currentPage: z.number().min(0),
});

export const sessionTokenSchema = z.object({
  sessionToken: z.string().min(1, "Le token de session est requis"),
});

// Error messages
export const ADMIN_ERRORS = {
  FETCH_USERS: "Erreur lors de la récupération des utilisateurs",
  FETCH_USER: "Erreur lors de la récupération de l'utilisateur",
  CREATE_USER: "Erreur lors de la création de l'utilisateur",
  UPDATE_USER: "Erreur lors de la mise à jour de l'utilisateur",
  DELETE_USER: "Erreur lors de la suppression de l'utilisateur",
  BAN_USER: "Erreur lors du bannissement de l'utilisateur",
  UNBAN_USER: "Erreur lors du débannissement de l'utilisateur",
  SET_ROLE: "Erreur lors de la modification du rôle de l'utilisateur",
  SESSIONS: "Erreur lors de la récupération des sessions de l'utilisateur",
  REVOKE_SESSIONS: "Erreur lors de la révocation des sessions de l'utilisateur",
  REVOKE_SESSION: "Erreur lors de la révocation de la session de l'utilisateur",
  IMPERSONATE: "Erreur lors de l'impersonation de l'utilisateur",
  SELF_ACTION: "Vous ne pouvez pas effectuer cette action sur vous-même",
  INVALID_FORM: "Données de formulaire invalides",
} as const;
