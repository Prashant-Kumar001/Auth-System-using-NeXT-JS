"use client";

import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import {
  OAuthProvider,
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
} from "@/lib/auth/O-auth-providers";
import { Link2Icon, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

const LinkedAccounts = ({ accounts }: { accounts: Account[] }) => {
  return (
    <div className="space-y-6">
      {/* LINKED ACCOUNTS */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground text-sm py-4">
              No accounts linked yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                provider={acc.providerId}
                account={acc}
              />
            ))}
          </div>
        )}
      </div>

      {/* LINK OTHER ACCOUNTS */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link Other Accounts</h3>

        {SUPPORTED_OAUTH_PROVIDERS.filter(
          (provider) => !accounts.some((acc) => acc.providerId === provider),
        ).map((provider) => (
          <AccountCard key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
};

const AccountCard = ({
  account,
  provider,
}: {
  account?: Account;
  provider: string;
}) => {
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[
    provider as OAuthProvider
  ] ?? {
    name: provider,
    icon: Shield,
  };

  const Icon = providerDetails.icon;

  const unlinkAccount = async () => {
    if (!account) {
      throw new Error("Account not found");
    }

    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  const linkAccount = async () => {
    return authClient.linkSocial({
      provider,
      callbackURL: "/profile",
    });
  };

  const isLinked = !!account;

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className="w-6 h-6" />

            <div>
              <p className="font-medium">{providerDetails.name}</p>

              {isLinked ? (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toDateString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not linked</p>
              )}
            </div>
          </div>

          {isLinked ? (
            <BetterAuthAction
              action={unlinkAccount}
              variant="destructive"
              size="sm"
              successMessage="Account unlinked"
              errorMessage="Failed to unlink account"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Unlink
            </BetterAuthAction>
          ) : (
            <BetterAuthAction
              action={linkAccount}
              variant="outline"
              size="sm"
              successMessage="Account linked"
              errorMessage="Failed to link account"
            >
              <Link2Icon className="w-4 h-4 mr-2" />
              Link
            </BetterAuthAction>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedAccounts;
