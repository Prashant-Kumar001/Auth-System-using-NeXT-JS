"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SignInPage from "./components/sign-in-tab";
import SignUpPage from "./components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./components/SocialAuthButtons";

const LoginPage = () => {
  return (
    <Tabs className="w-full max-w-sm" defaultValue="signin">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="signin">Login</TabsTrigger>
        <TabsTrigger value="sighup">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <Card className="">
          <CardContent>
            <SignInPage />
          </CardContent>
          <Separator aria-disabled />
          <CardFooter className="grid grid-cols-1 gap-1.5">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="sighup">
        <Card>
          <CardContent>
            <SignUpPage />
          </CardContent>
          <Separator aria-disabled />
          <CardFooter className="grid grid-cols-1 gap-1.5">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LoginPage;
