import { v4 as uuidv4 } from "uuid";
import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "~/lib/middleware/auth-guard";
import { handleServerError } from "~/lib/hooks/error-handler";
import { validateFormData } from "~/lib/hooks/validate-formdata";
import {
  TASK_ERRORS,
  taskIdSchema,
  updateTaskSchema,
  deleteTaskSchema,
  createTaskSchema,
} from "~/lib/constants/validators/task";

import { db } from "./db";
import { eq } from "drizzle-orm";
import { taskAssignees, tasks } from "./schema";

/**
 * Retrieves a paginated list of tasks for the authenticated user
 * @returns {Promise<{tasks: Task[]}>} Object containing list of tasks
 * @throws {Error} If fetching tasks fails
 */
export const listOrganizationTasks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const tasksData = await db.query.tasks.findMany({
        with: {
          tags: true,
          todos: true,
        },
      });

      return { tasks: tasksData };
    } catch (error) {
      handleServerError(error, TASK_ERRORS.FETCH);
    }
  });

/**
 * Creates a new task
 * Validates and processes form data containing task details
 * @param {FormData} data - Form data containing task details
 * @returns {Promise<{task: Task}>} Object containing the created task
 * @throws {Error} If task creation fails
 */
export const createOrganizationTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, createTaskSchema, TASK_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data }) => {
    try {
      await db.transaction(async (tx) => {
        // Create the task
        const [createdTask] = await tx.insert(tasks).values(data).returning();

        // Add assignees if provided
        if (data.assignees && data.assignees.length > 0) {
          await tx.insert(taskAssignees).values(
            data.assignees.map((assigneeId) => ({
              taskId: createdTask.id,
              assigneeId,
            })),
          );
        }

        return createdTask;
      });
    } catch (error) {
      handleServerError(error, TASK_ERRORS.CREATE);
    }
  });

/**
 * Retrieves detailed information about a specific task
 * @param taskId - Unique identifier of the task
 * @returns {Promise<{task: Task}>} Object containing task details
 * @throws {Error} If task retrieval fails
 */
export const readOrganizationTask = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(taskIdSchema)
  .handler(async ({ data: { taskId } }) => {
    try {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
        with: {
          tags: true,
          todos: true,
        },
      });

      return { task };
    } catch (error) {
      handleServerError(error, TASK_ERRORS.FETCH);
    }
  });

/**
 * Updates an existing task
 * Validates and processes form data containing task details
 * @param {FormData} data - Form data containing task details
 * @returns {Promise<{task: Task}>} Object containing the updated task
 */
export const updateOrganizationTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, updateTaskSchema, TASK_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data }) => {
    try {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, data.id),
      });

      if (!task) {
        throw new Error("Task not found");
      }

      await db
        .update(tasks)
        .set({
          ...data,
        })
        .where(eq(tasks.id, data.id));

      return { task };
    } catch (error) {
      handleServerError(error, TASK_ERRORS.UPDATE);
    }
  });

/**
 * Deletes a task
 * @param taskId - Unique identifier of the task
 * @returns {Promise<{task: Task}>} Object containing the deleted task
 * @throws {Error} If task deletion fails
 */
export const deleteOrganizationTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: FormData | unknown) => {
    return validateFormData(data, deleteTaskSchema, TASK_ERRORS.INVALID_FORM);
  })
  .handler(async ({ data }) => {
    try {
      await db.delete(tasks).where(eq(tasks.id, data.id));
    } catch (error) {
      handleServerError(error, TASK_ERRORS.DELETE);
    }
  });
