"use server";

import { sendEmailTest } from "@/lib/email/send-email";

export async function sendWelcomeEmail(user: { email: string; name?: string }) {

    // not in use because of resend email service

    // await sendEmail({
    //     from: "prashant0kumar101@gmail.com",
    //     to: user.email,
    //     subject: "Welcome to our platform!",
    //     template: "WELCOME",
    //     data: {
    //         name: user.name || "User",
    //     },
    // });

    // For testing with nodemailer
    await sendEmailTest({
        from: "prashant0kumar101@gmail.com",
        to: user.email,
        subject: "Welcome to our platform!",
        template: "WELCOME",
        data: {
            name: user.name || "User",
        },
    });


}
