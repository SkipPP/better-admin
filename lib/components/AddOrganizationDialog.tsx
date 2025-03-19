import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";

import { Plus, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Label } from "~/lib/components/ui/label";
import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/lib/components/ui/dialog";

import { createOrganization } from "~/server/organizations";

// Define validation schema
const organizationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  logo: z.string().nullish(),
});

export default function AddOrganizationDialog() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        logo: formData.get("logo") as File,
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
        await createOrganization({ data: formData });

        setIsOpen(false);

        router.invalidate();
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && formRef.current) {
          formRef.current.reset();
          setErrors({});
        }

        setIsOpen(open);
      }}
    >
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        <Plus className="mr-1 h-4 w-4" /> Ajouter
      </Button>

      <DialogContent>
        <DialogHeader className="gap-0">
          <DialogTitle>Ajouter une organisation</DialogTitle>

          <DialogDescription>
            Créez une nouvelle organisation en renseignant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} className="grid gap-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <FormField
              label="Nom"
              name="name"
              type="text"
              placeholder="Dev"
              errors={errors}
            />

            <FormField
              label="Slug"
              name="slug"
              type="text"
              placeholder="ab"
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

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="shadow-none"
              >
                Annuler
              </Button>
            </DialogClose>

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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
