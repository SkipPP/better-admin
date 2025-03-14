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
