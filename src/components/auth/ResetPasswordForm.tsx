"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { PasswordInput } from "../ui/password-input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await authClient.resetPassword(
        {
          token,
          newPassword: data.password,
        },
        {
          onSuccess: () => {
            toast.success("Redirecting to login...", {
              duration: 2000,
              id: "redirect",
              icon: <Spinner />,
              description: "Please check your email for the reset link.",
              action: {
                label: "Go Now",
                onClick: () => router.push("/auth/login"),
              },
            });
            setTimeout(() => {
              toast.dismiss("redirect");
              router.push("/auth/login");
            }, 2000);
            setError(null);
          },

          onError: (error) => {
            setError(error.error.message);
            toast.error(error.error.message || "Failed to reset password");
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Invalid or expired reset link");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div>
          <Alert variant={"destructive"}>
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            className="w-full mt-4"
            size={"sm"}
            variant="outline"
            onClick={() => router.push("/auth/login?tab=resetPassword")}
          >
            back to login
          </Button>
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div>
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
