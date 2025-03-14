import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../middleware/auth-guard";

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
  .validator(z.object({ name: z.string(), email: z.string(), password: z.string() }))
  .handler(async ({ data: { name, email, password } }) => {
    const { headers } = getWebRequest()!;

    const data = await auth.api.createUser({
      headers,
      body: { name, email, password, role: "user" },
    });

    return { user: data.user };
  });

export const readUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data: { userId } }) => {
    const { headers } = getWebRequest()!;

    const data = await auth.api.listUsers({
      headers,
      query: {
        filterField: "id",
        filterOperator: "eq",
        filterValue: userId,
      },
    });

    return { user: data.users[0], total: 1 };
  });

export const updateUser = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  )
  .handler(async ({ data: { userId, name, email, role } }) => {
    const { headers } = getWebRequest()!;

    const data = await auth.api.updateUser({
      headers,
      query: { id: userId },
      body: { name, email, role },
    });

    return { status: data.status };
  });

export const deleteUser = createServerFn({ response: "full" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data: { userId }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error("Vous ne pouvez pas vous supprimer vous-même");
    }

    const data = await auth.api.removeUser({ headers, body: { userId } });

    return { success: data.success };
  });
