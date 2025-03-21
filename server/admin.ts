import { createServerFn } from "@tanstack/react-start";
import { getWebRequest, setCookie } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { authMiddleware } from "../lib/middleware/auth-guard";

import { handleServerError } from "../lib/hooks/error-handler";
import { validateFormData } from "../lib/hooks/validate-formdata";

import {
  ADMIN_ERRORS,
  userIdSchema,
  userListSchema,
  createUserSchema,
  updateUserSchema,
  userSchema,
  banUserSchema,
  setUserRoleSchema,
  sessionTokenSchema,
  sessionSchema,
} from "../lib/constants/validators/admin";

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  banned?: {
    reason: string;
    expiresAt: Date;
  };
}

export type UserRole = "user" | "admin" | "superadmin";

export interface Session {
  token: string;
  userId: string;
  expiresAt: Date;
}

/**
 * Retrieves a paginated list of users
 * @param limit - Number of users per page
 * @param currentPage - Current page number (0-based)
 * @returns {Promise<{users: User[], total: number}>} List of users and total count
 * @throws {Error} If fetching users fails
 */
export const fetchUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(userListSchema)
  .handler(async ({ data: { limit, currentPage } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.listUsers({
        headers,
        query: { limit, offset: currentPage * limit },
      });

      return { users: data.users, total: data.total };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.FETCH_USERS);
    }
  });

/**
 * Creates a new user in the system
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password (min 8 characters)
 * @param role - User's role (user/admin/superadmin)
 * @returns {Promise<{user: User}>} Created user object
 * @throws {Error} If validation fails or user creation fails
 */
export const createUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, createUserSchema, ADMIN_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data }) => {
    const { headers } = getWebRequest()!;

    try {
      const { user } = await auth.api.createUser({
        headers,
        body: data,
      });

      return { user };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.CREATE_USER);
    }
  });

/**
 * Retrieves a single user by their ID
 * @param userId - ID of the user to retrieve
 * @returns {Promise<{user: User, total: number}>} User object and total count (always 1)
 * @throws {Error} If user retrieval fails
 */
export const readUser = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(userIdSchema)
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
      handleServerError(error, ADMIN_ERRORS.FETCH_USER);
    }
  });

/**
 * Updates an existing user's information
 * @param userId - ID of the user to update
 * @param name - New name for the user
 * @param role - New role for the user
 * @returns {Promise<{status: string}>} Update operation status
 * @throws {Error} If validation fails or update fails
 */
export const updateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, updateUserSchema, ADMIN_ERRORS.INVALID_FORM);
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
      handleServerError(error, ADMIN_ERRORS.UPDATE_USER);
    }
  });

/**
 * Deletes a user from the system
 * @param userId - ID of the user to delete
 * @returns {Promise<{success: boolean}>} Deletion operation status
 * @throws {Error} If user tries to delete themselves or deletion fails
 */
export const deleteUser = createServerFn({ response: "full" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, userSchema, ADMIN_ERRORS.INVALID_FORM);
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
      handleServerError(error, ADMIN_ERRORS.DELETE_USER);
    }
  });

/**
 * Bans a user for a specified duration
 * @param userId - ID of the user to ban
 * @param banReason - Reason for the ban
 * @param banExpiresIn - Ban expiration date (ISO string)
 * @returns {Promise<{user: User}>} Updated user object with ban information
 * @throws {Error} If user tries to ban themselves or ban operation fails
 */
export const banUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, banUserSchema, ADMIN_ERRORS.INVALID_FORM);
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
      handleServerError(error, ADMIN_ERRORS.BAN_USER);
    }
  });

/**
 * Removes a ban from a user
 * @param userId - ID of the user to unban
 * @returns {Promise<{user: User}>} Updated user object without ban information
 * @throws {Error} If user tries to unban themselves or unban operation fails
 */
export const unbanUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, userSchema, ADMIN_ERRORS.INVALID_FORM);
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
      handleServerError(error, ADMIN_ERRORS.UNBAN_USER);
    }
  });

/**
 * Updates a user's role in the system
 * @param userId - ID of the user to update
 * @param role - New role to assign
 * @returns {Promise<{user: User}>} Updated user object
 * @throws {Error} If validation fails or role update fails
 */
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, setUserRoleSchema, ADMIN_ERRORS.INVALID_FORM);
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
      handleServerError(error, ADMIN_ERRORS.SET_ROLE);
    }
  });

/**
 * Retrieves all active sessions for a user
 * @param userId - ID of the user to get sessions for
 * @param limit - Number of sessions per page
 * @param currentPage - Current page number (0-based)
 * @returns {Promise<{sessions: Session[], total: number}>} List of sessions and total count
 * @throws {Error} If session retrieval fails
 */
export const listUserSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(sessionSchema)
  .handler(async ({ data: { userId, limit, currentPage } }) => {
    const { headers } = getWebRequest()!;

    try {
      const data = await auth.api.listUserSessions({
        headers,
        body: { userId, limit, offset: currentPage * limit },
      });

      return { sessions: data.sessions, total: data.sessions.length };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.SESSIONS);
    }
  });

/**
 * Revokes all active sessions for a user
 * @param userId - ID of the user whose sessions to revoke
 * @returns {Promise<{success: boolean}>} Revocation operation status
 * @throws {Error} If user tries to revoke their own sessions or operation fails
 */
export const revokeAllUserSessions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(userIdSchema)
  .handler(async ({ data: { userId }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error("Vous ne pouvez pas révoquer vos propres sessions");
    }

    try {
      const data = await auth.api.revokeUserSessions({ headers, body: { userId } });

      return { success: data.success };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.REVOKE_SESSIONS);
    }
  });

/**
 * Revokes a specific session
 * @param sessionToken - Token of the session to revoke
 * @returns {Promise<{success: boolean}>} Revocation operation status
 * @throws {Error} If user tries to revoke their own session or operation fails
 */
export const revokeUserSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(sessionTokenSchema)
  .handler(async ({ data: { sessionToken }, context }) => {
    const { headers } = getWebRequest()!;

    if (sessionToken === context?.session?.token) {
      throw new Error("Vous ne pouvez pas révoquer votre propre session");
    }

    try {
      const data = await auth.api.revokeUserSession({ headers, body: { sessionToken } });

      return { success: data.success };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.REVOKE_SESSION);
    }
  });

/**
 * Impersonates another user's session
 * @param userId - ID of the user to impersonate
 * @returns {Promise<{session: Session, user: User}>} New session and user data
 * @throws {Error} If impersonation fails or user tries to impersonate themselves
 */
export const impersonateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(userIdSchema)
  .handler(async ({ data: { userId }, context }) => {
    const { headers } = getWebRequest()!;

    if (context?.user?.id === userId) {
      throw new Error(ADMIN_ERRORS.SELF_ACTION);
    }

    try {
      const data = await auth.api.impersonateUser({
        headers,
        body: { userId },
      });

      setCookie("session_token", data.session.token);

      return { session: data.session, user: data.user };
    } catch (error) {
      handleServerError(error, ADMIN_ERRORS.IMPERSONATE);
    }
  });
