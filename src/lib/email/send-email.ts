import { getEmailTemplate } from "./templates";
import { SendEmailOptions } from "./types";
import { resend } from "@/lib/resend";
import nodemailer from "nodemailer";


export async function sendEmail(options: SendEmailOptions) {
    try {
        const html =
            options.template === "CUSTOM"
                ? options.html
                : getEmailTemplate(options.template, options.data);

        const result = await resend.emails.send({
            from: 'prashant0kumar101@gmail.com',
            to: options.to,
            subject: options.subject,
            html: html!,
        });
        console.log("Email sent successfully:", result);

        return { success: true };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
}

export async function sendEmailTest(options: SendEmailOptions) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const html = options.template === "CUSTOM" ? options.html : getEmailTemplate(options.template, options.data);

    try {
        const info = await transporter.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: html,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error: unknown) {
        console.error("Email error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }

}