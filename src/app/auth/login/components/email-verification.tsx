"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30;

interface EmailVerificationProps {
  email: string;
}

const EmailVerification = ({ email }: EmailVerificationProps) => {
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_COOLDOWN);
  const [loading, setLoading] = React.useState(false);

  const resendDisabled = secondsLeft > 0 || loading;

  React.useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }

    try {
      setLoading(true);

      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/",
      });

      toast.success("Verification email resent successfully!");
      setSecondsLeft(RESEND_COOLDOWN);
    } catch (error) {
      toast.error("Failed to resend verification email");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p>
        Please check your inbox and click the verification link to activate your
        account.
      </p>

      {email && (
        <p className="text-sm text-muted-foreground">
          Sent to <span className="font-medium">{email}</span>
        </p>
      )}

      <Button
        onClick={handleResend}
        variant="outline"
        disabled={resendDisabled}
      >
        {loading && <Spinner className="mr-2" />}
        {secondsLeft > 0
          ? `Resend in ${secondsLeft}s`
          : "Resend Verification Email"}
      </Button>

      {secondsLeft > 0 && (
        <p className="text-sm text-muted-foreground">
          For security reasons, you can resend the email after{" "}
          <span className="font-medium">{secondsLeft}s</span>.
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
