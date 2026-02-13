import React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, LinkIcon, LoaderIcon, Shield, Trash2, User } from "lucide-react";
import ProfileUpdateForm from "./components/profile-update-form";
import { Button } from "@/components/ui/button";
import SetPasswordButton from "./components/set-password-button";
import ChangePasswordForm from "./components/change-password-form";
import SessionManagement from "./components/session-management";
import LinkedAccounts from "./components/link-accounts";
import DangerZone from "./components/danger-zone";
import TwoFactorAuthSystem from "./components/two-factor-auth-system";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/auth/login");

  const user = session.user;

  return (
    <div className="min-h-screen  flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-3">
        <Card className="w-full max-w-2xl shadow-xl rounded-2xl border-none">
          <CardHeader className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24 text-3xl font-semibold">
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>

            <Badge variant="secondary" className="rounded-full px-4 py-1">
              Verified User
            </Badge>
          </CardHeader>

          <Separator />

          <CardContent className="p-8 space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Favorite Number</span>
                <Badge variant="outline">
                  {user.favoriteNumber ?? "Not set"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* <div className="flex justify-end gap-3">
              <Button variant="secondary">Edit Profile</Button>
              <Button variant="destructive">Delete Account</Button>
            </div> */}
          </CardContent>
        </Card>
        <Tabs>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              <span className="max-sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              <span className="max-sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Key className="mr-2 h-4 w-4" />
              <span className="max-sm:hidden">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="accounts">
              <LinkIcon className="mr-2 h-4 w-4" />
              <span className="max-sm:hidden">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="danger">
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="max-sm:hidden">Danger</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your profile settings and personal information.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent>
                <ProfileUpdateForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <LoadingSuspense>
              <SecurityTab email={user.email} isTwoFactorEnabled={session.user.twoFactorEnabled ?? false} />
            </LoadingSuspense>
          </TabsContent>
          <TabsContent value="sessions">
            <LoadingSuspense>
              <SessionTab currentSessionToken={session.session.token} />
            </LoadingSuspense>
          </TabsContent>
          <TabsContent value="accounts">
            <LoadingSuspense>
              <LinkedAccountsTab />
            </LoadingSuspense>
          </TabsContent>
          <TabsContent value="danger">
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DangerZone />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const nonCredentialAccounts = accounts.filter(
    (acc) => acc.providerId !== "credential",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Manage your linked accounts on other platforms.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <LinkedAccounts accounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}

async function SessionTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions on other devices.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <SessionManagement
          currentSessionToken={currentSessionToken}
          sessions={sessions}
        />
      </CardContent>
    </Card>
  );
}

async function SecurityTab({ email, isTwoFactorEnabled }: { email: string, isTwoFactorEnabled: boolean }) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const hasPassword = accounts.some((acc) => acc.providerId === "credential");

  return (
    <div className="space-y-4">
      {hasPassword ? (
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update your account password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
          <CardFooter className="flex justify-end"></CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              You don&apos;t have a password set. Create one to enable password
              login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Set Password</Button>
          </CardFooter>
        </Card>
      )}
      {hasPassword && (
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <Badge
              variant={`${isTwoFactorEnabled ? "default" : "destructive"}`}
            >
              {
                isTwoFactorEnabled
                  ? "Enabled"
                  : "Not Enabled"
              }
            </Badge>
            <CardDescription>
              Enable two-factor authentication for added security.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <TwoFactorAuthSystem isEnabled={isTwoFactorEnabled}  />
          </CardContent>
          <CardFooter className="flex justify-end"></CardFooter>
        </Card>
      )}
    </div>
  );
}

function LoadingSuspense({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={<LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
    >
      {children}
    </React.Suspense>
  );
}
