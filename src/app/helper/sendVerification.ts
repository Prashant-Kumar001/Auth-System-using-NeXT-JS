"use server";

import { sendEmailTest } from "@/lib/email/send-email";

export async function sendVerificationEmail({
    user,
    url,
}: {
    user: { email: string; name?: string };
    url: string;
}) {

    // not in use because of resend email service

    // await sendEmail({
    //     from: "prashant0kumar101@gmail.com",
    //     to: user.email,
    //     subject: "Verify your email address",
    //     template: "VERIFICATION",
    //     data: {
    //         name: user.name || "User",
    //         verificationLink: url,
    //     },
    // });

    // For testing with nodemailer
    await sendEmailTest({
        from: "prashant0kumar101@gmail.com",
        to: user.email,
        subject: "Verify your email address",
        template: "VERIFICATION",
        data: {
            name: user.name || "User",
            verificationLink: url,
        },
    });


}
