"use client";

import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";

const DangerZone = () => {
    return (
      <BetterAuthAction
        require
        action={() => authClient.deleteUser({ callbackURL: "/" })}
        variant="destructive"
        successMessage="Account deletion initiated, Please check your email to confirm"
        errorMessage="Failed to delete account"
        loadingContent="Please wait..."
      >
        Delete Account
      </BetterAuthAction>
    );
};

export default DangerZone;
