import { Link } from "@tanstack/react-router";

import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container flex max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          404 - Page not found
        </h1>

        <p className="text-muted-foreground text-sm md:text-base">
          Sorry, we couldn't find the page you're looking for. <br />
          It might have been moved or deleted.
        </p>

        <Button asChild className="gap-2">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
