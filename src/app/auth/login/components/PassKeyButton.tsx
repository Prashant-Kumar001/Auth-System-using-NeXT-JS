"use client";

import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const PassKeyButton = () => {
  const router = useRouter();

  const { refetch } = authClient.useSession();

  // useEffect(() => {
  //   authClient.signIn.passkey(
  //     {
  //       autoFill: true,
  //     },
  //     {
  //       onSuccess: () => {
  //         refetch();
  //         router.push("/");
  //       },
  //     },
  //   );
  // }, [router, refetch]);

  return (
    <BetterAuthAction
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            refetch();
            router.push("/");
          },
        })
      }
      variant="outline"
      errorMessage="Something went wrong"
      loadingMessage="Logging account..."
      loadingText={<Spinner />}
      className="w-full"
    >
      Use Passkey
    </BetterAuthAction>
  );
};

export default PassKeyButton;
