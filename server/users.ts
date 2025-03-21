import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;

  const session = await auth.api.getSession({
    headers,
  });

  return session?.user || null;
});

export const getUserWithOrganizations = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getWebRequest()!;

    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return {
        user: null,
        organizations: [],
        activeOrganization: null,
      };
    }

    const organizationsPromise = auth.api.listOrganizations({
      headers,
    });

    const activeOrganizationPromise = auth.api.getFullOrganization({
      headers,
      params: { organizationId: session.session.activeOrganizationId },
    });

    const [organizations, activeOrganization] = await Promise.all([
      organizationsPromise,
      activeOrganizationPromise,
    ]);

    return {
      organizations,
      user: session.user,
      activeOrganization,
    };
  },
);

export type UserWithOrganizations = Awaited<ReturnType<typeof getUserWithOrganizations>>;
