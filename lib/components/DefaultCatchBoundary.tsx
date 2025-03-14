import React from "react";
import { type ErrorComponentProps } from "@tanstack/react-router";

import { APIError } from "better-auth";

import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface DefaultCatchBoundaryProps {
  error: Readonly<ErrorComponentProps | APIError>;
  reset: () => void;
}

export function DefaultCatchBoundary({ error, reset }: DefaultCatchBoundaryProps) {
  const errorCause = (error as APIError).status;
  const errorMessage =
    (error as APIError).message ||
    (error as ErrorComponentProps).error.message ||
    "Something went wrong";

  return (
    <React.Fragment>
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

      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          className="flex w-full items-center gap-2 sm:w-auto"
          onClick={() => (window.location.href = "/")}
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Button>

        <Button
          className="flex w-full items-center gap-2 sm:w-auto"
          onClick={() => reset()}
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      </div>
    </React.Fragment>
  );
}
