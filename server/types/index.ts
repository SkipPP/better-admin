import { meetings } from "../schema/meeting.schema";
import { user, organization, member, team, invitation } from "../schema/auth.schema";

export type User = typeof user.$inferSelect;

export type Member = typeof member.$inferSelect;

export type Organization = typeof organization.$inferSelect;

export type Team = typeof team.$inferSelect;

export type Meeting = typeof meetings.$inferSelect;
export type CreateMeeting = typeof meetings.$inferInsert;
export type FullMeeting = Meeting & {
  participants: User[];
};

export type Invitation = typeof invitation.$inferSelect;

export type FullInvitation = Invitation & {
  inviter: User;
  organization: FullOrganization;
};

export type FullOrganization = typeof organization.$inferSelect &
  Partial<{
    members?: OrganizationMember[];
    teams?: Team[];
    invitations?: Invitation[];
  }>;

export type OrganizationMember = Member &
  Partial<{
    user: User;
  }>;
