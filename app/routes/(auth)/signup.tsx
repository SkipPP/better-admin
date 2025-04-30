import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUpForm } from "~/components/auth/SignUpForm";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignUpForm,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});
