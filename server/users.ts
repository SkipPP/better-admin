import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";

import { db } from "./db";
import { eq } from "drizzle-orm";
import { organization, user as userTable } from "./schema/auth.schema";

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
      return null;
    }

    const user = await db.query.user.findFirst({
      where: eq(userTable.id, session.user.id),
      with: {
        members: {
          with: {
            organization: {
              with: {
                teams: true,
                members: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      const organizations = await db.query.organization.findMany({
        where: eq(organization.ownerId, user.id),
        with: {
          teams: true,
          members: {
            with: {
              user: true,
            },
          },
        },
      });

      return {
        ...user,
        organizations,
        activeOrganization: null,
      };
    }

    const organizations = user.members.map((member) => member.organization);
    const activeOrganization = organizations.find(
      (organization) => organization.id === session.session.activeOrganizationId,
    );

    return {
      ...user,
      organizations,
      activeOrganization: activeOrganization ?? null,
    };
  },
);

export type UserWithOrganizations = Awaited<ReturnType<typeof getUserWithOrganizations>>;
