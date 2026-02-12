'use server';
import { sendEmailTest } from "@/lib/email/send-email";

export async function sendDeleteAccountVerification({
    user,
    url,
}: {
    user: { email: string; name?: string };
    url: string;
}) {
    await sendEmailTest({
        from: "prashant0kumar101@gmail.com",
        to: user.email,
        subject: "Delete your account",
        template: "DELETE_ACCOUNT",
        data: {
            name: user.name || "User",
            DeleteLink: url,
        },
    });
}
