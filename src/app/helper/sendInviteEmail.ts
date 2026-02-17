'use server';
import { sendEmailTest } from "@/lib/email/send-email";

export async function sendInviteEmail({
   email,
   organization,
   inviter,
   invitation
}: {
    email: string;
    organization: { name: string };
    inviter: { name: string };
    invitation: { id: string };
}) {
    await sendEmailTest({
        from: "prashant0kumar101@gmail.com",
        to: email,
        subject: "You have been invited to join an organization",
        template: "ORGANIZATION_INVITATION",
        data: {
            email: email,
            organization: organization.name,
            inviter: inviter.name,
            invitation: invitation.id
        },
    });
}
