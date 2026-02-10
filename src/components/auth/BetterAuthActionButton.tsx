"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";

type BetterAuthActionButtonProps = {
  provider: string;
  label: string;
  icon?: React.ReactNode;
  callbackURL?: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
};

export const BetterAuthActionButton: React.FC<BetterAuthActionButtonProps> = ({
  provider,
  label,
  icon,
  callbackURL = "/",
  variant = "outline",
  className,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL,
      });
    } catch (error) {
      console.error("Social login error:", error);
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      disabled={loading}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className ?? ""}`}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : icon}
      {loading ? `Signing in...` : label}
    </Button>
  );
};
