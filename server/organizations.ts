import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

export const fetchOrganizations = createServerFn({ method: "GET" })
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
      const data = await auth.api.listOrganizations({
        headers,
        query: { limit, offset: currentPage * limit },
      });

      return { organizations: data };
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la récupération des organisations");
    }
  });

export const createOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const name = data.get("name");
    const slug = data.get("slug");
    const logo = data.get("logo");

    if (!name || !slug) {
      throw new Error("Le nom et le slug de l'organisation sont requis");
    }

    return {
      name: name.toString(),
      slug: slug.toString(),
      logo: logo?.toString(),
    };
  })
  .handler(async ({ data: { name, slug, logo } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.createOrganization({
        headers,
        body: { name, slug, logo },
      });

      return { organization: data };
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la création de l'organisation");
    }
  });

export const readOrganization = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.getFullOrganization({ headers, params: { id } });

      return { organization: data };
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la récupération de l'organisation");
    }
  });
