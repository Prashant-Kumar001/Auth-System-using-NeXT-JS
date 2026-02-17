import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/app/helper/sendPasswordResetEmail";
import { sendVerificationEmail } from "@/app/helper/sendVerification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "@/app/helper/sendWelcomeEmail";
import { sendDeleteAccountVerification } from "@/app/helper/sendDeleteAccountVerification";
import { admin as adminPlugin, twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { ac, admin, user } from "./permission";
import { organization } from "better-auth/plugins"
import { sendInviteEmail } from "@/app/helper/sendInviteEmail";
import { and, desc, eq } from "drizzle-orm";
import { member } from "@/drizzle/schema";
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { STRIPE_PLANS } from "./stripe";
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
})



export const auth = betterAuth({
    appName: "Better Auth",
    user: {
        additionalFields: {
            favoriteNumber: {
                type: "number",
                required: true,
            },
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendDeleteAccountVerification({ user, url });
            },
        },
        changeEmail: {
            enabled: true,
            requireEmailVerification: true,
            sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
                await sendVerificationEmail({
                    user: { ...user, email: newEmail },
                    url,
                });
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ user, url });
        },
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({ user, url });
        },
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => {
                return {
                    favoriteNumber: Number(profile.public_gists) || 0,
                };
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },
    plugins: [
        nextCookies(),
        twoFactor(),
        passkey(),
        organization({
            sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
                await sendInviteEmail({ email, organization, inviter: { name: inviter.user.name }, invitation });
            }
        }),
        adminPlugin({
            ac,
            roles: {
                admin,
                user,
            },
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            subscription: {
                enabled: true,
                plans: STRIPE_PLANS,
                authorizeReference: async ({user, referenceId, action}) => {
                    const memberItem = await db.query.member.findFirst({
                        where: and(
                            eq(member.organizationId, referenceId),
                            eq(member.userId, user.id)
                        )
                    })
                    if(action == 'upgrade-subscription' || action == 'cancel-subscription' || action == 'restore-subscription') {
                        return memberItem?.role == 'owner'
                    }
                    return memberItem != null
                }
            }
        })
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path.startsWith("/sign-up")) {
                const user = ctx.context.newSession?.user ?? {
                    name: ctx.body.name,
                    email: ctx.body.email,
                };
                if (user != null) {
                    await sendWelcomeEmail(user);
                }
            }
        }),
    },
    databaseHooks: {
        session: {
            create: {
                before: async userSession => {
                    const database = await db.query.member.findFirst({
                        where: eq(member.userId, userSession.userId),
                        orderBy: desc(member.createdAt),
                        columns: { organizationId: true }
                    })
                    return {
                        data: {
                            ...userSession,
                            activeOrganization: database?.organizationId
                        }
                    }
                }
            }
        }
    },
});
