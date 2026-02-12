"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
} from "@/lib/auth/O-auth-providers";
import React from "react";

const SocialAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(
    null,
  );

  const handlerSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      setLoadingProvider(null);
    }
  };

  return (
    <>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].icon;
        const name = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name;
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            variant="outline"
            disabled={isLoading}
            onClick={() => handlerSocialLogin(provider)}
            className="flex items-center gap-2"
          >
            {isLoading ? <Spinner /> : <Icon />}
            {isLoading ? `Signing in with ${name}...` : name}
          </Button>
        );
      })}
    </>
  );
};

export default SocialAuthButtons;
