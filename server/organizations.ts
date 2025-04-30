import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

import { handleServerError } from "../lib/hooks/error-handler";
import { validateFormData } from "../lib/hooks/validate-formdata";

import {
  createOrganizationSchema,
  deleteOrganizationSchema,
  memberSchema,
  ORGANIZATION_ERRORS,
  organizationIdSchema,
  organizationListSchema,
  removeOrganizationMemberSchema,
  updateOrganizationMemberRoleSchema,
  updateOrganizationSchema,
} from "../lib/constants/validators/organization";

import { db } from "./db";
import { eq } from "drizzle-orm";
import { user, organization, invitation } from "./schema";

export type OrganizationRole = "member" | "admin" | "owner";

/**
 * Retrieves a paginated list of organizations for the authenticated user
 * @param limit - Number of organizations per page
 * @param currentPage - Current page number for pagination
 * @returns {Promise<{organizations: Organization[]}>} Object containing list of organizations
 * @throws {Error} If fetching organizations fails
 */
export const listUserOrganizations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(organizationListSchema)
  .handler(async ({ data: { limit, currentPage }, context }) => {
    try {
      const [organizations] = await db.query.organization.findMany({
        where: eq(organization.ownerId, context.session.userId),
        limit,
        offset: currentPage * limit,
      });

      return { organizations };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Creates a new organization
 * Validates and processes form data containing organization details
 * @param name - Organization name
 * @param slug - Organization unique identifier
 * @param logo - Optional organization logo
 * @returns {Promise<{organization: Organization}>} Object containing the created organization
 * @throws {Error} If organization creation fails
 */
export const createOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      createOrganizationSchema,
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
  })
  .handler(async ({ data, context }) => {
    try {
      const [createdOrganization] = await db
        .insert(organization)
        .values({
          ...data,
          id: uuidv4(),
          ownerId: context.session.userId,
          createdAt: new Date(),
        })
        .returning();

      return { organization: createdOrganization };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.CREATE);
    }
  });

/**
 * Retrieves detailed information about a specific organization
 * @param organizationId - Unique identifier of the organization
 * @returns {Promise<{organization: Organization}>} Object containing organization details
 * @throws {Error} If organization retrieval fails
 */
export const readOrganization = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(organizationIdSchema)
  .handler(async ({ data: { organizationId } }) => {
    try {
      const readedOrganization = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId),
      });

      if (!readedOrganization) {
        throw new Error("Organization not found");
      }

      return { organization: readedOrganization };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Updates an existing organization's information
 * @param organizationId - Organization to update
 * @param name - New organization name
 * @param slug - New organization slug
 * @param logo - New organization logo (optional)
 * @returns {Promise<{organization: Organization}>} Object containing the updated organization
 * @throws {Error} If organization update fails
 */
export const updateOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      updateOrganizationSchema,
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
  })
  .handler(async ({ data }) => {
    try {
      const [updatedOrganization] = await db
        .update(organization)
        .set(data)
        .where(eq(organization.id, data.organizationId))
        .returning();

      return { organization: updatedOrganization };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.UPDATE);
    }
  });

/**
 * Deletes an organization
 * @param organizationId - Organization to delete
 * @returns {Promise<{success: boolean}>} Object containing the success status of the deletion
 * @throws {Error} If organization deletion fails
 */
export const deleteOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      deleteOrganizationSchema,
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
  })
  .handler(async ({ data: { organizationId } }) => {
    try {
      await db.delete(organization).where(eq(organization.id, organizationId));
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.DELETE);
    }
  });

/**
 * Sets the active organization for the current user
 * @param organizationId - Organization to set as active
 * @returns {Promise<{success: boolean}>} Object containing the success status of the operation
 * @throws {Error} If setting active organization fails
 */
export const setActiveOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(organizationIdSchema)
  .handler(async ({ data: { organizationId } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.setActiveOrganization({
        headers,
        body: { organizationId },
      });
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Invites a new member to an organization
 * @param organizationId - Organization to add member to
 * @param email - User email to add as member
 * @param role - Role to assign to the user (member/admin/owner)
 * @param teamId - Optional team to add the member to
 * @returns {Promise<{invitation: OrganizationInvitation}>} Object containing the created invitation
 * @throws {Error} If adding member fails
 */
export const inviteOrganizationMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      memberSchema.omit({ userId: true }),
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
  })
  .handler(async ({ data: { organizationId, email, role, teamId } }) => {
    const { headers } = getWebRequest()!;

    try {
      const invitation = await auth.api.createInvitation({
        headers,
        body: { organizationId, email: email!, role, teamId },
      });

      return { invitation };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Get invitation by id
 * @param invitationId - Invitation id
 * @returns {Promise<{invitation: OrganizationInvitation}>} Object containing the created invitation
 * @throws {Error} If adding member fails
 */
export const getInvitationById = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      invitationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const invitationData = await db.query.invitation.findFirst({
        where: eq(invitation.id, data.invitationId),
      });

      if (!invitationData) {
        return null;
      }

      const inviterUserPromise = db.query.user.findFirst({
        where: eq(user.id, invitationData.inviterId),
      });

      const organizationPromise = db.query.organization.findFirst({
        where: eq(organization.id, invitationData.organizationId),
        with: {
          members: true,
        },
      });

      const [inviterData, organizationData] = await Promise.all([
        inviterUserPromise,
        organizationPromise,
      ]);

      if (!inviterData || !organizationData) {
        return null;
      }

      return {
        ...invitationData,
        inviter: inviterData,
        organization: organizationData,
      };
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Adds a new member to an organization
 * @param organizationId - Organization to add member to
 * @param userId - User to add as member
 * @param role - Role to assign to the user (member/admin/owner)
 * @param teamId - Optional team to add the member to
 * @returns {Promise<{success: boolean}>} Object containing the success status of the operation
 * @throws {Error} If adding member fails
 */
export const addOrganizationMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, memberSchema, ORGANIZATION_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data: { organizationId, userId, role, teamId } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.addMember({
        headers,
        body: { organizationId, userId, role, teamId },
      });
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Updates the role of an organization member
 * Prevents modification of owner roles
 * @param organizationId - Target organization
 * @param memberId - Member whose role to update
 * @param role - New role to assign
 * @param userRole - Current role of the user
 * @returns {Promise<{success: boolean}>} Object containing the success status of the operation
 * @throws {Error} If updating member role fails
 */
export const updateOrganizationMemberRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      updateOrganizationMemberRoleSchema,
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
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
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });

/**
 * Removes a member from an organization
 * @param organizationId - Organization to remove member from
 * @param memberIdOrEmail - ID or email of the member to remove
 * @returns {Promise<{success: boolean}>} Object containing the success status of the operation
 * @throws {Error} If removing member fails
 */
export const removeOrganizationMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(
      data,
      removeOrganizationMemberSchema,
      ORGANIZATION_ERRORS.INVALID_FORM,
    );
  })
  .handler(async ({ data: { organizationId, memberIdOrEmail } }) => {
    const { headers } = getWebRequest()!;

    try {
      await auth.api.removeMember({
        headers,
        body: { memberIdOrEmail, organizationId },
      });
    } catch (error) {
      handleServerError(error, ORGANIZATION_ERRORS.FETCH);
    }
  });
