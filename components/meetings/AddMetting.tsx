import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";

import { Plus, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/ui/multi-select";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "~/components/ui/dialog";

import { OrganizationMember } from "~/server/types";
import { createOrganizationMeeting } from "~/server/meeting";
import { meetingSchema } from "~/lib/constants/validators/meeting";

export default function AddMeetingDialog({
  members,
}: {
  members?: OrganizationMember[];
}) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (formData: FormData) => {
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: formData.get("date") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        participants: formData.get("participants"),
      };

      try {
        meetingSchema.parse(data);
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
        await createOrganizationMeeting({ data: formData });

        setIsOpen(false);

        router.invalidate();
        toast.success("Meeting créé avec succès");
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
      <Button variant="dashed" onClick={() => setIsOpen(true)} className="cursor-pointer">
        <Plus className="mr-1 h-4 w-4" /> Ajouter
      </Button>

      <DialogContent>
        <DialogHeader className="gap-0">
          <DialogTitle>Ajouter un meeting</DialogTitle>

          <DialogDescription>
            Créez un nouveau meeting en renseignant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} className="grid gap-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <FormField
              label="Titre"
              name="title"
              type="text"
              placeholder="Réunion avec John Doe"
              errors={errors}
            />

            <FormField
              label="Description"
              name="description"
              type="text"
              placeholder="Réunion avec John Doe"
              errors={errors}
            />

            <FormField
              label="Date"
              name="date"
              type="date"
              placeholder="2025-01-01"
              errors={errors}
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>

                <Select name="startTime">
                  <SelectTrigger id="startTime" className="w-full">
                    <SelectValue placeholder="09:00" />
                  </SelectTrigger>

                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>

                <Select name="endTime">
                  <SelectTrigger id="endTime" className="w-full">
                    <SelectValue placeholder="10:00" />
                  </SelectTrigger>

                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="members">Participants</Label>

              <MultiSelect
                title="Participants"
                options={
                  members?.map((member) => ({
                    label: member.userId,
                    value: member.user?.name ?? "",
                  })) ?? []
                }
                selectedValues={new Set()}
                onSelectionChange={() => {}}
              />
            </div>
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
  errors,
  label,
  name,
  type,
  placeholder,
  autoFocus = false,
}: {
  errors: Record<string, string>;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
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
        aria-invalid={!!errors[name]}
        className="shadow-none"
      />

      {errors[name] && <p className="text-destructive text-xs">{errors[name]}</p>}
    </div>
  );
}
