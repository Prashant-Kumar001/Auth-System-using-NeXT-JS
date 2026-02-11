"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30; // seconds

const EmailVerification = ({ email }: { email: string }) => {
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_COOLDOWN);
  const [loading, setLoading] = React.useState(false);

  const resendDisabled = secondsLeft > 0;

  // 🔹 Start countdown on mount
  React.useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    setLoading(true);

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/",
      });

      toast.success("Verification email resent successfully!");
      setSecondsLeft(RESEND_COOLDOWN); // 🔁 reset timer
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

      <Button
        onClick={handleResend}
        variant="outline"
        disabled={resendDisabled || loading}
      >
        {loading && <Spinner className="mr-2" />}
        {resendDisabled
          ? `Resend in ${secondsLeft}s`
          : "Resend Verification Email"}
      </Button>

      {resendDisabled && (
        <p className="text-sm text-muted-foreground">
          For security reasons, you can resend the email after{" "}
          <span className="font-medium">{secondsLeft}s</span>.
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
