import React from "react";

import { toast } from "sonner";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/button";

import authClient from "~/lib/utils/auth-client";

export const SignInButton = ({
  provider,
  REDIRECT_URL,
}: {
  provider:
    | "apple"
    | "discord"
    | "facebook"
    | "github"
    | "google"
    | "keycloak"
    | "microsoft"
    | "spotify"
    | "twitch"
    | "twitter"
    | "dropbox"
    | "linkedin"
    | "gitlab"
    | "tiktok"
    | "reddit"
    | "roblox"
    | "vk";
  REDIRECT_URL: string;
}) => {
  return (
    <Button
      key={provider}
      type="button"
      variant="secondary"
      className="w-full cursor-pointer"
      onClick={() => {
        if (provider !== "keycloak") {
          authClient.signIn.social({
            provider: provider,
            callbackURL: REDIRECT_URL,
            fetchOptions: {
              onRequest: () => {
                toast.info("Connexion en cours...");
              },
              onError: (error) => {
                toast.error(
                  `Erreur lors de la connexion avec ${provider.charAt(0).toUpperCase() + provider.slice(1)} :`,
                  {
                    description: `Erreur ${error.error?.status}`,
                  },
                );
              },
            },
          });
        } /*  else {
          authClient.signIn.oauth2({
            providerId: "keycloak",
            callbackURL: REDIRECT_URL,
            fetchOptions: {
              onRequest: () => {
                toast.info("Connexion en cours...");
              },
              onError: (error) => {
                toast.error(`Erreur lors de la connexion avec Keycloak :`, {
                  description: `Erreur ${error.error?.status}`,
                });
              },
            },
          });
        } */
      }}
    >
      {React.createElement(Icons[provider as keyof typeof Icons] || Icons.keycloak)}
      {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </Button>
  );
};
