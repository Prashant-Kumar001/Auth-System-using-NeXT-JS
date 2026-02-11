"use client";

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
import { useState } from "react";
import EmailVerification from "./components/email-verification";
import ForgotPassword from "./components/ForgotPassword";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "signin" | "signup" | "email-verification" | "forgot-password"
  >("signin");



  const handleEmailVerification = (email: string) => {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  return (
    <Tabs
      className="w-full max-w-sm"
      value={selectedTab}
      onValueChange={(value) =>
        setSelectedTab(value as "signin" | "signup" | "email-verification" | "forgot-password")
      }
    >
      {selectedTab !== "email-verification" && (
        <TabsList className="grid w-full grid-cols-2 mb-6">
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
