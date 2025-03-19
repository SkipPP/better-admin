import { z } from "zod";
import { useState, useCallback, useRef } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { RotateCcw, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Card } from "~/lib/components/ui/card";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Button } from "~/lib/components/ui/button";

import { createOrganization } from "~/server/organizations";

// Define validation schema
const organizationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  logo: z.string().nullish(),
});

export const Route = createFileRoute("/dashboard/organizations/add/")({
  component: AddOrganizationRoute,
});

function AddOrganizationRoute() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        logo: formData.get("logo") as string,
      };

      try {
        organizationSchema.parse(data);
        setErrors({});

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};

          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as string] = err.message;
            }
          });

          setErrors(newErrors);
        }

        return false;
      }
    },
    [setErrors],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);

      if (!validateForm(formData)) return;

      setIsSubmitting(true);

      try {
        const { organization } = await createOrganization({ data: formData });

        router.navigate({
          to: "/dashboard/organizations/$organizationId",
          params: { organizationId: organization?.id ?? "" },
          search: { organizationName: organization?.name },
        });

        toast.success("Organisation créée avec succès");
      } catch (error) {
        toast.error("Une erreur est survenue :", {
          description: error instanceof Error ? error.message : "Erreur inconnue",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, validateForm],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Ajouter une organisation</h1>

          <p className="text-muted-foreground text-sm">
            Créez une nouvelle organisation en renseignant les informations ci-dessous.
          </p>
        </div>

        <Button size="icon" variant="secondary" onClick={() => formRef.current?.reset()}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-none py-0 shadow-none md:border-dashed md:py-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 px-0 md:px-6">
          <div className="grid grid-cols-1 gap-6 px-0 md:grid-cols-2">
            <FormField
              label="Nom"
              name="name"
              type="text"
              placeholder="John Doe"
              autoFocus
              errors={errors}
            />

            <FormField
              label="Slug"
              name="slug"
              type="text"
              placeholder="john-doe"
              errors={errors}
            />

            <FormField
              disabled
              label="Logo"
              name="logo"
              type="file"
              accept="image/*"
              errors={errors}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-end">
            <Button
              asChild
              variant="outline"
              disabled={isSubmitting}
              className="cursor-default shadow-none"
            >
              <Link to="/dashboard/organizations" search={{ limit: 10, currentPage: 0 }}>
                Annuler
              </Link>
            </Button>

            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Reusable form field component
function FormField({
  disabled = false,
  errors,
  label,
  name,
  type,
  placeholder,
  accept,
  autoFocus = false,
}: {
  disabled?: boolean;
  errors: Record<string, string>;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  accept?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        accept={accept}
        aria-invalid={!!errors[name]}
        disabled={disabled}
        className="shadow-none"
      />

      {errors[name] && <p className="text-destructive text-xs">{errors[name]}</p>}
    </div>
  );
}
