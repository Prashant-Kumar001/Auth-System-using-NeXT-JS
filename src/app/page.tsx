"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { authClient } from "../lib/auth/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/Toggle-button";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";

const Page = () => {
  const { data: session, isPending: loading } = authClient.useSession();
  const [adminPermission, setAdminPermission] = React.useState(false);

  useEffect(() => {
    authClient.admin
      .hasPermission({
        permission: {
          user: ["list"],
        },
      })
      .then(({ data }) => {
        setAdminPermission(data?.success ?? false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Spinner className="w-12 h-12 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br  flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border-none rounded-2xl">
        <CardContent className="p-8 flex flex-col items-center text-center gap-6">
          <ModeToggle />
          {session === null ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Welcome 👋</h1>
                <p className="text-muted-foreground">
                  Please login to continue to your dashboard.
                </p>
              </div>

              <Link href="/auth/login" className="w-full">
                <Button className="w-full rounded-xl">Log in</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                  Welcome back, {session.user?.name || "User"} 🎉
                </h1>
                <p className="text-muted-foreground">
                  You are successfully logged in.
                </p>
              </div>

              <div className="flex w-full gap-3">
                <BetterAuthAction
                  variant="destructive"
                  className="flex-1 rounded-xl"
                  action={() => authClient.signOut()}
                  errorMessage="something went wrong"
                  loadingText={<Spinner className="w-4 h-4" />}
                >
                  Log out
                </BetterAuthAction>

                <Link href="/profile" className="flex-1">
                  <Button variant="secondary" className="w-full rounded-xl">
                    Profile
                  </Button>
                </Link>
                {adminPermission && (
                  <Link href="/admin" className="flex-1">
                    <Button variant="secondary" className="w-full rounded-xl">
                      Admin
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
