import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/app/helper/sendPasswordResetEmail";
import { sendVerificationEmail } from "@/app/helper/sendVerification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "@/app/helper/sendWelcomeEmail";
import { sendDeleteAccountVerification } from "@/app/helper/sendDeleteAccountVerification";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey"



export const auth = betterAuth({
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
            }
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
    plugins: [nextCookies(), twoFactor(), passkey()],
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
});
