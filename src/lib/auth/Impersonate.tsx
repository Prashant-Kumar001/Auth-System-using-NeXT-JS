'use client';
import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { UserX } from "lucide-react";
import { toast } from "sonner";

const Impersonate = () => {
    const router = useRouter();
    const { data: session, refetch } = authClient.useSession();
    if (session?.session.impersonatedBy == null) return null;
    return (
        <div className="fixed bottom-4 left-20 z-50">
            <BetterAuthAction
                variant="destructive"
                size="sm"
                action={() =>
                    authClient.admin
                        .stopImpersonating(undefined, {
                            onSuccess: () => {
                                refetch();
                                router.push("/admin");
                                refetch()
                            },
                            onError: (error) => {
                                console.error(error);
                                toast.error("Failed to stop impersonation");
                            },
                        })
                }
            >
                <UserX className="h-5 w-5" />
            </BetterAuthAction>
        </div>
    );
};

export default Impersonate;
