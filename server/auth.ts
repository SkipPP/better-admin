import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { db } from "./db";
import { member } from "./schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  plugins: [
    admin(),
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10, // Optional: limit teams per organization
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
      },
      async sendInvitationEmail(data) {
        const inviteLink = `http://localhost:3000/accept-invitation?invitationId=${data.id}`;

        console.log({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),
  ],

  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Find user's organizations
          const userOrgs = await db
            .select()
            .from(member)
            .where(eq(member.userId, session.userId));

          // Set first organization as active if available
          const activeOrgId = userOrgs.length > 0 ? userOrgs[0].organizationId : null;

          return {
            data: {
              ...session,
              activeOrganizationId: activeOrgId,
            },
          };
        },
      },
    },
  },

  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
