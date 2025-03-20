import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

export const fetchUserOrganizations = createServerFn({ method: "GET" })
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
  .validator(z.object({ organizationId: z.string() }))
  .handler(async ({ data: { organizationId } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.getFullOrganization({
        headers,
        query: { organizationId },
      });

      return { organization: data };
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la récupération de l'organisation");
    }
  });

export const updateOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");
    const name = data.get("name");
    const slug = data.get("slug");
    const logo = data.get("logo");

    if (!organizationId || !name || !slug) {
      throw new Error("Le nom et le slug de l'organisation sont requis");
    }

    return {
      organizationId: organizationId.toString(),
      name: name.toString(),
      slug: slug.toString(),
      logo: logo?.toString(),
    };
  })
  .handler(async ({ data: { organizationId, name, slug, logo } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.updateOrganization({
        headers,
        query: { organizationId },
        body: { data: { name, slug, logo }, organizationId },
      });

      return { organization: data };
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la modification de l'organisation");
    }
  });

export const deleteOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");

    if (!organizationId) {
      throw new Error("L'identifiant de l'organisation est requis");
    }

    return {
      organizationId: organizationId.toString(),
    };
  })
  .handler(async ({ data: { organizationId } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.deleteOrganization({
        headers,
        body: { organizationId },
        query: { organizationId },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la suppression de l'organisation");
    }
  });

export const addMemberToOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");
    const userId = data.get("userId");
    const role = data.get("role");
    const teamId = data.get("teamId");

    if (!organizationId || !userId || !role) {
      throw new Error(
        "L'identifiant de l'organisation, l'identifiant de l'utilisateur et le rôle sont requis",
      );
    }

    return {
      organizationId: organizationId.toString(),
      userId: userId.toString(),
      role: role.toString() as "member" | "admin" | "owner",
      teamId: teamId?.toString(),
    };
  })
  .handler(async ({ data: { organizationId, userId, role, teamId } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.addMember({
        headers,
        body: { organizationId, userId, role, teamId },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de l'ajout d'un membre à l'organisation");
    }
  });

export const updateOrganizationMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");
    const userId = data.get("userId");
    const userRole = data.get("userRole");
    const role = data.get("role");

    if (!organizationId || !userId || !role || !userRole) {
      throw new Error(
        "L'identifiant de l'organisation, l'identifiant de l'utilisateur et le rôle sont requis",
      );
    }

    return {
      organizationId: organizationId.toString(),
      memberId: userId.toString(),
      role: role.toString() as "member" | "admin" | "owner",
      userRole: userRole.toString() as "member" | "admin" | "owner",
    };
  })
  .handler(async ({ data: { organizationId, memberId, role, userRole } }) => {
    const { headers } = getWebRequest()!;

    if (userRole === "owner") {
      throw new Error("Le rôle de propriétaire ne peut pas être modifié");
    }

    try {
      await auth.api.updateMemberRole({
        headers,
        body: { organizationId, memberId, role },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la modification du rôle du membre");
    }
  });

export const removeMemberFromOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");
    const memberIdOrEmail = data.get("memberIdOrEmail");

    if (!organizationId || !memberIdOrEmail) {
      throw new Error(
        "L'identifiant de l'organisation et l'identifiant de l'utilisateur sont requis",
      );
    }

    return {
      organizationId: organizationId.toString(),
      memberIdOrEmail: memberIdOrEmail.toString(),
    };
  })
  .handler(async ({ data: { organizationId, memberIdOrEmail } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.removeMember({
        headers,
        body: { memberIdOrEmail, organizationId },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la suppression d'un membre de l'organisation");
    }
  });

export const addTeamToOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const organizationId = data.get("organizationId");
    const name = data.get("name");

    if (!organizationId || !name) {
      throw new Error(
        "L'identifiant de l'organisation et le nom de l'équipe sont requis",
      );
    }

    return {
      organizationId: organizationId.toString(),
      name: name.toString(),
    };
  })
  .handler(async ({ data: { organizationId, name } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.createTeam({
        headers,
        body: { organizationId, name },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de l'ajout d'une équipe à l'organisation");
    }
  });

export const updateOrganizationTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const teamId = data.get("teamId");
    const name = data.get("name");

    if (!teamId || !name) {
      throw new Error("L'identifiant de l'équipe et le nom sont requis");
    }

    return {
      teamId: teamId.toString(),
      name: name.toString(),
    };
  })
  .handler(async ({ data: { teamId, name } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.updateTeam({
        headers,
        body: { teamId, data: { name } },
      });
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erreur lors de la modification de l'équipe");
    }
  });
