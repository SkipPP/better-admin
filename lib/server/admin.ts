import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";

export const fetchUsers = createServerFn({ method: "GET" })
  .validator(
    z.object({
      limit: z.number(),
      currentPage: z.number(),
    }),
  )
  .handler(async ({ data: { limit, currentPage } }) => {
    const { headers } = getWebRequest()!;

    const data = await auth.api.listUsers({
      headers,
      query: { limit, offset: currentPage * limit },
    });

    return { users: data.users, total: data.total };
  });

export const createUser = createServerFn({ method: "POST" })
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

export const deleteUser = createServerFn()
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data: { userId } }) => {
    const { headers } = getWebRequest()!;

    const data = await auth.api.removeUser({ headers, body: { userId } });

    return { success: data.success };
  });
