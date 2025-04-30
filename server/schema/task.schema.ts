import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

export const labelEnum = pgEnum("label", ["Bug", "Feature", "Hotfix", "Release"]);
export const priorityEnum = pgEnum("priority", ["Urgent", "High", "Medium", "Low"]);
export const statusEnum = pgEnum("status", [
  "Backlog",
  "Todo",
  "In Progress",
  "In Review",
  "Done",
  "Cancelled",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  dueDate: timestamp(),
  status: statusEnum("status").notNull(),
  priority: priorityEnum("priority").notNull(),
  progress: integer().notNull().default(0),
  assignees: text().array(),
  files: text().array(),
  comments: text().array(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const taskTags = pgTable("task_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid().references(() => tasks.id),
  label: labelEnum("label").notNull(),
  color: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid().references(() => tasks.id),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const taskAssignees = pgTable("task_assignees", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid().references(() => tasks.id),
  assigneeId: text().references(() => user.id),
  createdAt: timestamp().notNull().defaultNow(),
});

export const taskRelations = relations(tasks, ({ many }) => ({
  tags: many(taskTags),
  todos: many(todos),
  assignees: many(taskAssignees),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  task: one(tasks, {
    fields: [todos.taskId],
    references: [tasks.id],
  }),
}));

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAssignees.taskId],
    references: [tasks.id],
  }),
}));

export type Task = typeof tasks.$inferSelect & {
  tags: TaskTag[];
  todos: Todo[];
};
export type NewTask = typeof tasks.$inferInsert;

export type TaskTag = typeof taskTags.$inferSelect;
export type NewTaskTag = typeof taskTags.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
