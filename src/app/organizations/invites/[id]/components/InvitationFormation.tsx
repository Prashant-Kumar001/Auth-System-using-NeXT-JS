'use client';

import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

const InvitationFormation = ({
  invitation,
}: {
  invitation: {
    id: string;
    email: string;
    role: string;
    organizationName: string;
  };
}) => {
  const router = useRouter();

  const handlerAcceptInvitation = async () => {
    return await authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.id,
          }, {
            onSuccess: () => {
              router.push(`/organizations/`);
            }
          });
        },
      },
    );
  };

  const handlerDeclineInvitation = async () => {
    return await authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onSuccess: () => {
          router.push(`/`);
        },
      },
    );
  };

  return (
    <div className="flex gap-4">
      <BetterAuthAction
        action={handlerAcceptInvitation}
        variant="destructive"
        size="sm"
      >
        Accept
      </BetterAuthAction>
      <BetterAuthAction
        action={handlerDeclineInvitation}
        variant="destructive"
        size="sm"
      >
        Decline
      </BetterAuthAction>
    </div>
  );
};

export default InvitationFormation;
