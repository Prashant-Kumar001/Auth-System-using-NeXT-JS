
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvitationFormation from "./components/InvitationFormation";

export default async function AcceptInvitationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/auth/login");

  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: { id },
  }).catch(() => redirect("/"));

  return (
    <div className="container flex items-center justify-center min-h-screen ">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the ${invitation.organizationName}{" "}
            organization as a {invitation.role}.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <InvitationFormation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}
