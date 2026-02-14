"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import { UserWithRole } from "better-auth/plugins";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type UsersTableProps = {
  user: UserWithRole;
  selfId: string;
};

export default function UsersTable({ user, selfId }: UsersTableProps) {
  const router = useRouter();

  const { refetch } = authClient.useSession();
  const isSelf = user.id === selfId;

  const handleBanToggle = async () => {
    const action = user.banned
      ? authClient.admin.unbanUser
      : authClient.admin.banUser;

    action(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success(
            user.banned
              ? "User unbanned successfully"
              : "User banned successfully",
          );
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to update ban status");
        },
      },
    );
  };

  const handleDeleteUser = async () => {
    authClient.admin.removeUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          router.refresh();
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to delete user");
        },
      },
    );
  };

  const handleRevokeSessions = async () => {
    authClient.admin.revokeUserSession(
      { sessionToken: user.id },
      {
        onSuccess: () => {
          toast.success("User sessions revoked");
          router.refresh();
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to revoke sessions");
        },
      },
    );
  };

  const handleImpersonate = async () => {
    authClient.admin.impersonateUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("Now impersonating user");
          refetch();
          router.push("/");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to impersonate user");
        },
      },
    );
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <span className="font-medium">{user.name || "No name"}</span>

            {isSelf && <Badge variant="secondary">You</Badge>}

            {user.banned && <Badge variant="destructive">Banned</Badge>}
          </div>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">{user.email}</TableCell>

      <TableCell>
        <Badge variant="outline">{user.role || "user"}</Badge>
      </TableCell>

      <TableCell>
        <Badge variant={user.emailVerified ? "default" : "secondary"}>
          {user.emailVerified ? "Verified" : "Not verified"}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleImpersonate}>
                  Impersonate
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleRevokeSessions}>
                  Revoke Sessions
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleBanToggle}>
                  {user.banned ? "Unban User" : "Ban User"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently delete
                  <br />
                  <strong>{user.email}</strong>
                  <br />
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
