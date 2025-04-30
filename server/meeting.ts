import { v4 as uuidv4 } from "uuid";
import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "~/lib/middleware/auth-guard";
import { handleServerError } from "~/lib/hooks/error-handler";
import { validateFormData } from "~/lib/hooks/validate-formdata";
import { MEETING_ERRORS, meetingSchema } from "~/lib/constants/validators/meeting";

import { db } from "./db";
import { meetings } from "./schema";
import { participants } from "./schema";

/**
 * Retrieves a paginated list of meetings for the authenticated user
 * @returns {Promise<{meetings: Meeting[]}>} Object containing list of meetings
 * @throws {Error} If fetching meetings fails
 */
export const listOrganizationMeetings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const meetingsData = await db.query.meetings.findMany({
        with: {
          participants: true,
        },
      });

      return { meetings: meetingsData };
    } catch (error) {
      handleServerError(error, MEETING_ERRORS.FETCH);
    }
  });

/**
 * Creates a new organization
 * Validates and processes form data containing organization details
 * @param {FormData} data - Form data containing meeting details
 * @returns {Promise<{meeting: Meeting}>} Object containing the created meeting
 * @throws {Error} If meeting creation fails
 */
export const createOrganizationMeeting = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, meetingSchema, MEETING_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data, context }) => {
    try {
      await db.transaction(async (tx) => {
        // Create the meeting
        const [createdMeeting] = await tx
          .insert(meetings)
          .values({
            ...data,
            id: uuidv4(),
            ownerId: context.session.userId,
            organizationId: context.session.activeOrganizationId!,
          })
          .returning();

        // Add members if provided
        if (data.members && data.members.length > 0) {
          await tx.insert(participants).values(
            data.members.map((memberId) => ({
              meetingId: createdMeeting.id,
              memberId,
            })),
          );
        }

        return createdMeeting;
      });
    } catch (error) {
      handleServerError(error, MEETING_ERRORS.CREATE);
    }
  });
