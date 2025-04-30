import { relations } from "drizzle-orm";

import { meetings } from "./meeting.schema";
import { organization, member, user, team } from "./auth.schema";

export const userRelations = relations(user, ({ many }) => ({
  members: many(member),
  organizations: many(organization),
}));

// After defining your tables, add relations
export const organizationRelations = relations(organization, ({ many, one }) => ({
  teams: many(team),
  members: many(member),
  meetings: many(meetings),
  owner: one(user, {
    fields: [organization.ownerId],
    references: [user.id],
  }),
}));

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));

export const teamRelations = relations(team, ({ one }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
}));
