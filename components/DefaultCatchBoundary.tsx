import React from "react";
import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";

import { APIError } from "better-auth";

import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface DefaultCatchBoundaryProps {
  error: Readonly<ErrorComponentProps | APIError>;
}

export function DefaultCatchBoundary({ error }: DefaultCatchBoundaryProps) {
  const router = useRouter();

  const errorCause = (error as APIError).status;
  const errorMessage =
    (error as APIError).message ||
    (error as ErrorComponentProps).error.message ||
    "Something went wrong";

  return (
    <div className="flex flex-col items-start gap-y-6">
      <div className="space-y-1">
        <div className={"leading-none font-bold tracking-tight"}>
          L'application a rencontré une erreur
        </div>

        <div className="text-muted-foreground text-sm">
          Une erreur inattendue est survenue dans l'application :
        </div>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />

        <AlertTitle>Error {errorCause && `: (${errorCause})`}</AlertTitle>

        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>

      <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <Button
          variant="link"
          className="flex w-full cursor-pointer items-center gap-2 sm:w-auto"
          onClick={() => (window.location.href = "/")}
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Button>

        <Button
          className="flex w-full items-center gap-2 sm:w-auto"
          onClick={() => router.invalidate()}
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}
