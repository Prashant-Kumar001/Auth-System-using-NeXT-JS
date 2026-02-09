"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { authClient } from "../lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

const page = () => {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return (
      <div className="container flex flex-col mt-12 items-center  mx-auto w-full ">
        <Spinner color="gray" className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container w-full min-h-screen">
      <div className="flex w-full max-w-7xl mx-auto flex-col justify-center items-center">
        {session === null ? (
          <div className="flex mt-12 flex-col items-center">
            <Link href="auth/login">
              <Button>Log in</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-12  flex gap-2 items-center ">
            <h1>Welcome to Our App</h1>
            <p>Logged in as {session.user?.name}</p>
            <Button
              variant={"destructive"}
              onClick={() => authClient.signOut()}
            >
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
