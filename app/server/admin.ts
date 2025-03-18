import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

export const fetchUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      limit: z.number(),
      currentPage: z.number(),
    }),
  )
  .handler(async ({ data: { limit, currentPage } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.listUsers({
        headers,
        query: { limit, offset: currentPage * limit },
      });

      return { users: data.users, total: data.total };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  });

export const createUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const role = data.get("role");

    if (!name || !role || !email || !password) {
      throw new Error(
        "Le nom, le rôle, l'email et le mot de passe de l'utilisateur sont requis",
      );
    }

    return {
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
      role: role.toString(),
    };
  })
  .handler(async ({ data: { name, email, password, role } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.createUser({
        headers,
        body: { name, email, password, role: role ?? "user" },
      });

      return { user: data.user };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  });

export const readUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data: { userId } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.listUsers({
        headers,
        query: {
          filterField: "id",
          filterOperator: "eq",
          filterValue: userId,
        },
      });

      return { user: data.users[0], total: 1 };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  });

export const updateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const userId = data.get("userId");
    const name = data.get("name");
    const role = data.get("role");

    if (!userId || !name || !role) {
      throw new Error(
        !userId
          ? "L'identifiant de l'utilisateur est requis"
          : !name
            ? "Le nom de l'utilisateur est requis"
            : !role
              ? "Le rôle de l'utilisateur est requis"
              : "Une erreur est survenue",
      );
    }

    return {
      userId: userId.toString(),
      name: name.toString(),
      role: role.toString(),
    };
  })
  .handler(async ({ data: { userId, name, role } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.updateUser({
        headers,
        query: { id: userId },
        body: { name, role },
      });

      return { status: data.status };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  });

export const deleteUser = createServerFn({ response: "full" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const userId = data.get("userId");

    if (!userId) {
      throw new Error(
        !userId ? "L'identifiant de l'utilisateur est requis" : "Une erreur est survenue",
      );
    }

    return {
      userId: userId.toString(),
    };
  })
  .handler(async ({ data: { userId }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error("Vous ne pouvez pas vous supprimer vous-même");
    }

    try {
      const data = await auth.api.removeUser({ headers, body: { userId } });

      return { success: data.success };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  });

export const banUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const userId = data.get("userId");
    const banReason = data.get("banReason");
    const banExpiresIn = data.get("banExpiresIn");

    if (!userId || !banReason || !banExpiresIn) {
      throw new Error(
        !userId
          ? "L'identifiant de l'utilisateur est requis"
          : !banReason
            ? "La raison du bannissement est requise"
            : !banExpiresIn
              ? "La date d'expiration du bannissement est requise"
              : "Une erreur est survenue",
      );
    }

    const banExpiresInDate = new Date(banExpiresIn.toString());
    const differenceInMilliseconds = banExpiresInDate.getTime() - new Date().getTime();

    if (isNaN(banExpiresInDate.getTime())) {
      throw new Error("La date d'expiration du bannissement est invalide");
    }

    return {
      userId: userId.toString(),
      banReason: banReason.toString(),
      banExpiresIn: Math.floor(differenceInMilliseconds / 1000),
    };
  })
  .handler(async ({ data: { userId, banReason, banExpiresIn }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error("Vous ne pouvez pas vous supprimer vous-même");
    }

    try {
      const data = await auth.api.banUser({
        headers,
        body: { userId, banReason, banExpiresIn },
      });

      return { user: data.user };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la bannissement de l'utilisateur");
    }
  });

export const unbanUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const userId = data.get("userId");

    if (!userId) {
      throw new Error(
        !userId ? "L'identifiant de l'utilisateur est requis" : "Une erreur est survenue",
      );
    }

    return {
      userId: userId.toString(),
    };
  })
  .handler(async ({ data: { userId }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error("Vous ne pouvez pas vous supprimer vous-même");
    }

    try {
      const data = await auth.api.unbanUser({
        headers,
        body: { userId },
      });

      return { user: data.user };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la débannissement de l'utilisateur");
    }
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const userId = data.get("userId");
    const role = data.get("role");

    if (!userId || !role) {
      throw new Error(
        !userId
          ? "L'identifiant de l'utilisateur est requis"
          : !role
            ? "Le rôle de l'utilisateur est requis"
            : "Une erreur est survenue",
      );
    }

    return {
      userId: userId.toString(),
      role: role.toString(),
    };
  })
  .handler(async ({ data: { userId, role } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.setRole({
        headers,
        body: { userId, role },
      });

      return { user: data.user };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la modification du rôle de l'utilisateur");
    }
  });

export const listUserSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string(),
      limit: z.number(),
      currentPage: z.number(),
    }),
  )
  .handler(async ({ data: { userId, limit, currentPage } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.listUserSessions({
        headers,
        body: { userId, limit, offset: currentPage * limit },
      });

      return { sessions: data.sessions, total: data.sessions.length };
    } catch (error) {
      console.error(error);

      throw new Error("Erreur lors de la récupération des sessions de l'utilisateur");
    }
  });
