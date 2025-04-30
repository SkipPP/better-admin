import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

import { user, team, organization, member } from "./auth.schema";

export const meetings = pgTable("meeting", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  start: timestamp("start").notNull().defaultNow(),
  end: timestamp("end").notNull().defaultNow(),
  allDay: boolean("all_day").notNull().default(false),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const participants = pgTable("participants", {
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meetings.id, { onDelete: "cascade" }),
  memberId: text("member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetingRelations = relations(meetings, ({ one, many }) => ({
  participants: many(participants),
  owner: one(user, {
    fields: [meetings.ownerId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [meetings.organizationId],
    references: [organization.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  meeting: one(meetings, {
    fields: [participants.meetingId],
    references: [meetings.id],
  }),
  member: one(member, {
    fields: [participants.memberId],
    references: [member.id],
  }),
}));
