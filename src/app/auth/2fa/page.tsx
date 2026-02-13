import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TotpForm from "./components/totp-form";
import BackupCodesForm from "./components/backup-codes-form";

const TwoFactorPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Two Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList>
              <TabsTrigger value="totp">TOTP</TabsTrigger>
              <TabsTrigger value="backup-codes">Backup Codes</TabsTrigger>
            </TabsList>
            <TabsContent value="totp">
              <TotpForm />
            </TabsContent>
            <TabsContent value="backup-codes">
              <BackupCodesForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorPage;
