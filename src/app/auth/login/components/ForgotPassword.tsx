"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = ({
  openSignInTab,
}: {
  openSignInTab: () => void;
}) => {
  const [error, setError] = useState<{
    message: string;
    description: string;
  } | null>({
    message: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: "/auth/reset-password",
        },
        {
          onSuccess: () => {
            toast.success("Password reset email sent successfully!");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to send reset email");
            console.error(error);
            setError({
              message: error.error.message,
              description: error.error.description,
            });
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-4">
      {error?.message && (
        <Alert variant={"destructive"}>
          <AlertTitle>{error?.message}</AlertTitle>
          <AlertDescription>{error?.description}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        {isSubmitting && <Spinner className="mr-2" />}
        Send reset link
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:underline"
          onClick={openSignInTab}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
