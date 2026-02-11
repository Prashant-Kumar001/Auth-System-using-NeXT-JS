"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInPage from "./components/sign-in-tab";
import SignUpPage from "./components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./components/SocialAuthButtons";
import EmailVerification from "./components/email-verification";
import ForgotPassword from "./components/ForgotPassword";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  const handleEmailVerification = useCallback((emailArg: string) => {
    setEmail(emailArg);
    setSelectedTab("email-verification");
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value as Tab);
  }, []);

  const showTabList = selectedTab === "signin" || selectedTab === "signup";

  return (
    <Tabs
      className="w-full max-w-sm"
      value={selectedTab}
      onValueChange={handleTabChange}
    >
      {showTabList && (
        <TabsList
          className="grid w-full grid-cols-2 mb-6"
          aria-label="Authentication tabs"
        >
          <TabsTrigger value="signin">Login</TabsTrigger>
          <TabsTrigger value="signup">Register</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInPage
              openEmailVerificationTab={handleEmailVerification}
              openForgotPassword={() => setSelectedTab("forgot-password")}
            />
          </CardContent>
          <Separator aria-disabled />
          <CardFooter className="grid grid-cols-1 gap-1.5">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpPage openEmailVerificationTab={handleEmailVerification} />
          </CardContent>
          <Separator aria-disabled />
          <CardFooter className="grid grid-cols-1 gap-1.5">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="email-verification">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forgot-password">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LoginPage;
