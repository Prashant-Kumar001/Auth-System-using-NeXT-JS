"use client";

import { useAsyncAction } from "@/app/helper/useAsyncAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { Session } from "better-auth";
import { ComputerIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

const SessionManagement = ({
  currentSessionToken,
  sessions,
}: {
  currentSessionToken: string;
  sessions: Session[];
}) => {
  const router = useRouter();

  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);

  const { execute, loading } = useAsyncAction(
    async () => {
      await authClient.revokeOtherSessions(undefined, {
        onSuccess: () => {
          router.refresh();
        },
      });
    },
    {
      confirmMessage: "Are you sure you want to revoke all sessions?",
      successMessage: "Sessions revoked successfully.",
      loadingMessage: "Revoking sessions...",
    },
  );

  return (
    <div className="flex flex-col gap-2">
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Current Session</CardTitle>
            <CardDescription>
              This is your current active session. You can revoke other sessions
              if you notice any suspicious activity.
            </CardDescription>
            <CardContent>
              <SessionCard session={currentSession} isCurrent />
            </CardContent>
          </CardHeader>
        </Card>
      )}

      {otherSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Other Active Sessions</CardTitle>
            <Button disabled={loading} variant="destructive" onClick={execute}>
              {loading ? <Spinner /> : "Revoke All"}
            </Button>
            <CardDescription>
              These are your other active sessions. You can revoke any session
              that you don&apos;t recognize or no longer use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {otherSessions.map((session) => (
              <SessionCard key={session.token} session={session} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionManagement;

function SessionCard({
  session,
  isCurrent = false,
}: {
  session: Session;
  isCurrent?: boolean;
}) {
  // const router = useRouter();
  const parser = new UAParser(session.userAgent || "");
  const ua = parser.getResult();

  function getDeviceIcon() {
    switch (ua.device.type) {
      case "mobile":
        return <SmartphoneIcon className="h-5 w-5" />;
      case "tablet":
        return <TabletIcon className="h-5 w-5" />;
      default:
        return <ComputerIcon className="h-5 w-5" />;
    }
  }

  function getDeviceName() {
    if (!ua.browser.name && !ua.os.name) {
      return "Unknown Device";
    }

    return `${ua.browser.name ?? ""} ${
      ua.browser.version ?? ""
    } on ${ua.os.name ?? ""}`;
  }

  function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  const { execute, loading } = useAsyncAction(
    async () => {
      return await authClient.revokeSession(
        {
          token: session.token,
        },

        {
          onError: (error) => {
            console.log(error);
          },

          onSuccess: (data) => {
            console.log(data);
            // router.refresh();
          },
        },
      );
    },
    {
      confirmMessage: "Revoke this session?",
      successMessage: "Session revoked",
      errorMessage: "Failed to revoke session",
      loadingMessage: "Revoking session...",
      refresh: true,
    },
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getDeviceIcon()}
          <CardTitle className="text-2xl">{getDeviceName()}</CardTitle>
          {isCurrent && <Badge variant="secondary">Current</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">IP:</span>{" "}
          {session.ipAddress ?? "Unknown"}
        </p>

        <p>
          <span className="font-medium text-foreground">Created:</span>{" "}
          {formatDate(session.createdAt)}
        </p>

        <p>
          <span className="font-medium text-foreground">Expires:</span>{" "}
          {formatDate(session.expiresAt)}
        </p>
      </CardContent>

      {!isCurrent && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={execute}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Revoking...
              </>
            ) : (
              "Revoke session"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
