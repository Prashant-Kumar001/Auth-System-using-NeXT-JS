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
import { Loader2 } from "lucide-react";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { Spinner } from "@/components/ui/spinner";

const MemberTab = () => {
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();

  const { data: session } = authClient.useSession();

  function removeUser(memberId: string) {
    return authClient.organization.removeMember(
      { memberIdOrEmail: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed successfully.");
        },
        onError: (err) => {
          toast.error(err.error?.message || "Failed to remove member.");
        },
      },
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-10">
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

  const members = activeOrganization.members || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <div className="text-muted-foreground text-sm">No members found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.user?.name || "No name"}
                  </TableCell>

                  <TableCell>{member.user?.email}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        member.role == "owner"
                          ? "default"
                          : member.role == "admin"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {member.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {member.userId !== session?.user.id && (
                      <BetterAuthAction
                        action={() => removeUser(member.userId)}
                        variant="destructive"
                        successMessage="Member removed successfully."
                        errorMessage="Failed to remove member."
                        toastMessage="Removing member..."
                        loadingContent={<Spinner />}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberTab;
