import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

import { handleServerError } from "../lib/hooks/error-handler";
import { validateFormData } from "../lib/hooks/validate-formdata";

import {
  createTeamSchema,
  updateTeamSchema,
  TEAM_ERRORS,
} from "../lib/constants/validators/organization-teams";

// Type definitions
export interface Team {
  id: string;
  name: string;
  organizationId: string;
}

/**
 * Creates a new team within an organization
 * @param organizationId - ID of the organization to create team in
 * @param name - Name of the new team
 * @returns Object containing the created team
 */
export const createOrganizationTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, createTeamSchema, TEAM_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data: { organizationId, name } }) => {
    const { headers } = getWebRequest()!;

    try {
      const team = await auth.api.createTeam({
        headers,
        body: { organizationId, name },
      });

      return { team };
    } catch (error) {
      handleServerError(error, TEAM_ERRORS.CREATE);
    }
  });

/**
 * Updates an existing team's information
 * @param teamId - ID of the team to update
 * @param name - New name for the team
 * @returns Object containing the updated team
 */
export const updateOrganizationTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, updateTeamSchema, TEAM_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data: { teamId, name } }) => {
    const { headers } = getWebRequest()!;

    try {
      const team = await auth.api.updateTeam({
        headers,
        body: { teamId, data: { name } },
      });

      return { team };
    } catch (error) {
      handleServerError(error, TEAM_ERRORS.UPDATE);
    }
  });
