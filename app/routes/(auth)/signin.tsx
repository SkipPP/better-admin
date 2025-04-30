import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignInForm } from "~/components/auth/SignInForm";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/(auth)/signin")({
  component: SignInForm,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});
