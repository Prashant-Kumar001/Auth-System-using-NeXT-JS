import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import MemberTab from "./MemberTab";
import InvitationsTab from "./InvitationsTab";
import SubscriptionsTab from "./SubscriptionsTab";

const OrganizationTabs = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <div className="space-y-4">
      {activeOrganization && (
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="space-x-2 w-full">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="settings">Subscriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <MemberTab />
          </TabsContent>
          <TabsContent value="invitations">
            <InvitationsTab />
          </TabsContent>
          <TabsContent value="settings">
            <SubscriptionsTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};



export default OrganizationTabs;
