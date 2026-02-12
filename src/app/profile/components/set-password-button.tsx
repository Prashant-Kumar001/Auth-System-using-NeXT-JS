import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import React from "react";
import { toast } from "sonner";

const SetPasswordButton = ({ email }: { email: string }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSetPassword = () => {
    setIsLoading(true);
    try {
      authClient.requestPasswordReset(
        {
          email,
          redirectTo: "/auth/reset-password",
        },
        {
          onSuccess: () => {
            console.log("Password reset email sent successfully!");
            toast.success(
              "Password reset email sent! Please check your inbox.",
            );
          },
          onError: (error) => {
            console.error("Error sending password reset email:", error);
            toast.error(
              "Failed to send password reset email. Please try again.",
            );
          },
        },
      );
    } catch (error: Error | unknown) {
      toast.error("Failed to send password reset email. Please try again.");
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button disabled={isLoading} variant={"destructive"} onClick={handleSetPassword}>
        {
            isLoading ? <Spinner /> : "Set Password"
        }
      </Button>
    </div>
  );
};

export default SetPasswordButton;
