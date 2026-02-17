"use client";

import React, { useState, ButtonHTMLAttributes } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type BetterAuthActionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: () => Promise<any>;
  toastMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  loadingContent?: string | React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  disabled?: boolean;
  require?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BetterAuthAction({
  action,
  toastMessage,
  successMessage,
  errorMessage,
  loadingContent = "Please wait...",
  children,
  disabled,
  size = "default",
  require = false,
  ...props
}: BetterAuthActionProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    if (require) {
      const confirmed = window.confirm("Are you sure?");
      if (!confirmed) return;
    }

    setLoading(true);

    const toastId = toast.loading(toastMessage || "Processing...");

    try {
      const result = await action();

      console.log(result)


      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        result.error
      ) {
        throw new Error(result.error.message || result.error.statusText || "Request failed");
      }

      toast.success(successMessage || "Success", {
        id: toastId,
      });
    } catch (err) {
      const error = err as Error;
      toast.error(errorMessage || error.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size={`${size}`}
      data-loading={loading}
      data-variant={props.variant}
      variant={props.variant}
      {...props}
      onClick={handleClick}
      disabled={loading || disabled}
    >
      {loading ? loadingContent : children}
    </Button>
  );
}
