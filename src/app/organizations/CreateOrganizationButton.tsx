"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

const CreateOrganizationButtonSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
});

type FormType = z.infer<typeof CreateOrganizationButtonSchema>;

function generateSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CreateOrganizationButton() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(CreateOrganizationButtonSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: FormType) {
    const res = await authClient.organization.create({
      name: data.name,
      slug: generateSlug(data.name),
    });

    if (res.error) {
      toast.error(res.error.message || "Something went wrong");
    } else {
      toast.success("Organization created successfully.");
      reset();
      setOpenDialog(false);
      await authClient.organization.setActive({
        organizationId: res.data.id,
      });
      router.refresh();
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary">Create</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>Create a new organization</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Organization Name</FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter organization name"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="grid grid-cols-1 gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Spinner />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
