'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  useEffect(() => {
   authClient.getSession().then((session) => {
      if (session.data !== null ) {
        router.push("/");
      }
    });
  }, [router]);

  return (
    <div className="h-screen flex flex-col w-full  items-center justify-center">
      {children}
    </div>
  );
}
