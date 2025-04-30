import { useRouter } from "@tanstack/react-router";

import { FullInvitation } from "~/server/types";
import authClient from "~/lib/utils/auth-client";

import { Check, Clock, User, Users, X } from "lucide-react";

import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { BorderBeam } from "~/components/ui/border-beam";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "~/components/ui/card";

interface OrganizationInvitationProps {
  invitation: FullInvitation;
}

export function OrganizationInvitation({ invitation }: OrganizationInvitationProps) {
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
        fetchOptions: {
          onSuccess: () => {
            toast.info("You will be redirected to the organization dashboard shortly.");

            setTimeout(function () {
              router.navigate({ to: "/dashboard", reloadDocument: true });
            }, 2000);
          },
          onError: (error) => {
            toast.error("Error accepting invitation :", {
              description: error.error.message,
            });
          },
        },
      });
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitation.id,
        fetchOptions: {
          onSuccess: () => {
            toast.info("You will be redirected shortly.");

            setTimeout(function () {
              router.navigate({ to: "/", reloadDocument: true });
            }, 2000);
          },
          onError: (error) => {
            toast.error("Error declining invitation :", {
              description: error.error.message,
            });
          },
        },
      });
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  return (
    <Card className="relative border-dashed">
      <BorderBeam
        duration={12}
        size={400}
        className="via-muted-foreground/40 from-transparent to-transparent"
      />
      <BorderBeam
        duration={12}
        delay={6}
        size={400}
        className="via-muted-foreground/40 from-transparent to-transparent"
      />

      <CardHeader>
        <div className="text-center">
          <CardTitle className="text-2xl">{invitation.organization?.name}</CardTitle>

          <div className="mt-1 flex items-center justify-center gap-2">
            {invitation.role && (
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {invitation.role.substring(0, 1).toUpperCase() +
                  invitation.role?.substring(1)}
              </Badge>
            )}

            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {invitation.organization?.members?.length} membre(s)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-muted/50 border-border rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {invitation.inviter?.name?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{invitation.inviter?.name}</span>

                <Badge variant="secondary" className="text-xs">
                  {invitation.inviter?.role?.toUpperCase()}
                </Badge>
              </div>

              <p className="text-muted-foreground text-sm italic">message ?</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-x-4 text-sm">
            <span className="text-muted-foreground">Identifiant</span>

            <span className="font-medium">{invitation.id}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Expire le
            </span>

            <span>{invitation.expiresAt.toLocaleString("fr-FR")}</span>
          </div>
        </div>

        {invitation.status === "accepted" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 flex items-center gap-5 rounded-lg bg-green-50 p-4 text-green-800 duration-500 dark:bg-green-950/20 dark:text-green-300">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-800/30">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <p className="font-medium">Invitation acceptée</p>
              <p className="text-sm text-green-700 italic dark:text-green-400">
                Bienvenue dans {invitation.organizationId} !
              </p>
            </div>
          </div>
        )}

        {invitation.status === "rejected" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 flex items-center gap-5 rounded-lg bg-red-50 p-4 text-red-800 duration-500 dark:bg-red-950/20 dark:text-red-300">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-800/30">
              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>

            <div>
              <p className="font-medium">Invitation refusée</p>
              <p className="text-sm text-red-700 italic dark:text-red-400">
                Vous avez refusé cette invitation.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="destructive"
          onClick={handleDecline}
          disabled={invitation.status !== "pending"}
          className="flex-1"
        >
          Refuser
        </Button>

        <Button
          variant="secondary"
          onClick={handleAccept}
          disabled={invitation.status !== "pending"}
          className="flex-1"
        >
          Accepter
        </Button>
      </CardFooter>
    </Card>
  );
}
