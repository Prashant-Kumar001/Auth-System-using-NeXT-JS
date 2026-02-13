"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AsyncAction<T> = () => Promise<T>;

type UseAsyncActionOptions<T> = {
    successMessage?: string;
    errorMessage?: string;
    loadingMessage?: string;
    confirmMessage?: string;
    redirectTo?: string;
    refresh?: boolean;
    extractErrorMessage?: (error: unknown) => string;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
};

export function useAsyncAction<T>(
    action: AsyncAction<T>,
    options?: UseAsyncActionOptions<T>
) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const execute = useCallback(async (): Promise<T> => {
        if (loading) {
            throw new Error("Action already in progress");
        }

        if (options?.confirmMessage) {
            const confirmed = window.confirm(options.confirmMessage);
            if (!confirmed) {
                throw new Error("Action cancelled by user");
            }
        }

        setLoading(true);

        const toastId = toast.loading(
            options?.loadingMessage ?? "Processing..."
        );

        try {
            const result = await action()
            if (
                result &&
                typeof result === "object" &&
                "error" in result &&
                result.error
            ) {
                throw new Error(
                    (result as unknown as { error: { statusText: string } }).error.statusText || "Request failed"
                );
            }

            toast.success(options?.successMessage ?? "Success", {
                id: toastId,
            });

            options?.onSuccess?.(result);

            if (options?.redirectTo) {
                router.push(options.redirectTo);
            }

            if (options?.refresh) {
                router.refresh();
            }

            return result;
        } catch (err: unknown) {
            const error =
                err instanceof Error ? err : new Error("Unknown error");

            const message =
                options?.extractErrorMessage?.(err) ??
                error.message ??
                options?.errorMessage ??
                "Something went wrong";

            toast.error(message, { id: toastId });

            options?.onError?.(error);

            throw error;
        } finally {
            setLoading(false);
        }
    }, [action, loading, options, router]);

    return {
        execute,
        loading,
    };
}
