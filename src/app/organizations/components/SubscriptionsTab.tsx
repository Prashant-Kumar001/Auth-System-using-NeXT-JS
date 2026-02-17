"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Subscription } from "@better-auth/stripe";
import { PLAN_TO_PRICE, STRIPE_PLANS } from "@/lib/auth/stripe";
import { BetterAuthAction } from "@/components/auth/BetterAuthActionButton";
import { toast } from "sonner";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const SubscriptionsTab = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (activeOrganization == null) {
      return;
    }


    authClient.subscription
      .list({
        query: {
          referenceId: activeOrganization.id,
        },
      })
      .then((result) => {
        if (result.error) {
          setSubscriptions([]);
          toast.error(result.error.message);
          return;
        }
        console.log("subscriptions", result);
        setSubscriptions(result.data);
      });
  }, [activeOrganization]);

  const activeSubscription = subscriptions.find(
    (sub) => sub.status == "active" || sub.status === "trialing",
  );

  const activePlan = STRIPE_PLANS.find(
    (plan) => plan.name === activeSubscription?.plan,
  );

  console.log("activePlan", activePlan);
  console.log("activeSubscription", activeSubscription);

  async function handleBillingPortal() {
    if (activeOrganization == null) {
      return {
        error: {
          message: "No organization found",
        },
      };
    }

    const res = await authClient.subscription.billingPortal({
      referenceId: activeOrganization.id,
      returnUrl: window.location.href,
    });

    if (res.error == null) {
      window.location.href = res.data.url;
    }

    return res;
  }

  async function handleCancelSubscription() {
    if (activeOrganization == null) {
      return Promise.resolve({ error: { message: "No organization found" } });
    }

    if (activeSubscription == null) {
      return Promise.resolve({ error: { message: "No subscription found" } });
    }

    return authClient.subscription.cancel({
      subscriptionId: activeSubscription.id,
      referenceId: activeSubscription.id,
      returnUrl: window.location.href,
    });
  }
  async function handleSubscriptionChange(name: string) {
    if (activeOrganization == null) {
      return Promise.resolve({ error: { message: "No organization found" } });
    }

    return authClient.subscription.upgrade({
      referenceId: activeOrganization.id,
      plan: name,
      returnUrl: window.location.href,
      successUrl: window.location.href,
      cancelUrl: window.location.href,
    });
  }

  return (
    <div className="space-y-6">
      {activeSubscription && activePlan && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Manage your organization billing and subscription.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold capitalize">
                    {activeSubscription.plan}
                  </h1>
                  {activeSubscription.priceId && (
                    <Badge variant={"secondary"}>
                      {currencyFormatter.format(
                        PLAN_TO_PRICE[activeSubscription.plan],
                      )}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activePlan?.limits.projects}
                  projects included
                </p>
                <p>
                  {activeSubscription.periodEnd &&
                    (activeSubscription.cancelAtPeriodEnd
                      ? "Cancel On"
                      : "Renew On")}
                  {activeSubscription.priceId?.toString()}
                </p>
              </div>
              <BetterAuthAction variant="outline" action={handleBillingPortal}>
                Billing Portal
              </BetterAuthAction>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4  md:grid-cols-2">
        {STRIPE_PLANS.map((plan) => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text0xl capitalize">
                  {plan.name}
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currencyFormatter.format(PLAN_TO_PRICE[plan.name])}
                  </div>
                </div>
              </div>
              <CardDescription>
                Up to {plan.limits.projects} projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSubscription?.plan == plan.name ? (
                activeSubscription.cancelAtPeriodEnd ? (
                  <Button disabled variant={"outline"} className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <BetterAuthAction
                    variant="outline"
                    action={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </BetterAuthAction>
                )
              ) : (
                <BetterAuthAction
                  variant="outline"
                  action={() => handleSubscriptionChange(plan.name)}
                >
                  {activeSubscription == null ? "Subscribe" : "Change Plan"}
                </BetterAuthAction>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsTab;
