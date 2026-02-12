"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth/auth-client";

const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;

const ChangePasswordForm = () => {
  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    await authClient.changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: data.revokeOtherSessions,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully.");
          form.reset();
        },
        onError: (error) => {
          console.log("Error updating password:", error);

          const errorMessage = error.error?.message || "Something went wrong.";

          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Update Password</CardTitle>
      </CardHeader>

      
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Current Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>New Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="revokeOtherSessions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="inline-flex"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel>Revoke Other Sessions</FieldLabel>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
