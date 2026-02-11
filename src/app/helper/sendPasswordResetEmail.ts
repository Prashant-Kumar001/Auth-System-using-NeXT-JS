'use server';
import {  sendEmailTest } from "@/lib/email/send-email";

export async function sendPasswordResetEmail({
    user,
    url,
}: {
    user: { email: string; name?: string };
    url: string;
}) {
    const res = await sendEmailTest({
        from: "prashant0kumar101@gmail.com",
        to: user.email,
        subject: "Reset your password",
        template: "PASSWORD_RESET",
        data: {
            name: user.name || "User",
            resetUrl: url,
        },
    });

    console.log(res);
}
