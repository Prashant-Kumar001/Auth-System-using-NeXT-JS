"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { authClient } from "../lib/auth/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/Toggle-button";

const Page = () => {
  const { data: session, isPending: loading } = authClient.useSession();

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
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl"
                  onClick={() => authClient.signOut()}
                >
                  Log out
                </Button>

                <Link href="/profile" className="flex-1">
                  <Button variant="secondary" className="w-full rounded-xl">
                    Profile
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
