"use client";

import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Loader2, X } from "lucide-react";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { Spinner } from "@/components/ui/spinner";
import CreateInvitationsButton from "./CreateInvitationsButton";

const InvitationsTab = () => {
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();

  const pendingInvite = activeOrganization?.invitations?.filter(
    (invite) => invite.status === "pending",
  );

  function cancelInvitation(invitationId: string) {
    return authClient.organization.cancelInvitation(
      { invitationId },
      {
        onSuccess: () => {
          toast.success("Invitation canceled successfully.");
        },
        onError: (err) => {
          toast.error(err.error?.message || "Failed to cancel invitation.");
        },
      },
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No active organization found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateInvitationsButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>

        <CardContent>
          {pendingInvite?.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No pending invitations.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pendingInvite?.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">
                      {invite.email}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{invite.status}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {invite.status === "pending" && (
                        <BetterAuthAction
                          action={() => cancelInvitation(invite.id)}
                          variant="destructive"
                          successMessage="Invitation canceled successfully."
                          errorMessage="Failed to cancel invitation"
                          loadingContent={<Spinner />}
                        >
                          <X className="h-4 w-4" />
                        </BetterAuthAction>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationsTab;
