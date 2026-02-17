import { authClient } from "@/lib/auth/auth-client";
import React from "react";
import {
  Select,
  SelectContent,
//   SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const OrganizationSelect = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) return null;

  const setActiveOrganization = (organizationId: string) => {
    authClient.organization.setActive({ organizationId }, {
      onSuccess: () => {
        toast.success("Organization changed successfully.");
      },
      onError: (err) => {
        toast.error(err.error?.message || "Failed to change organization.");
      },
    });
  };

  return (
    <Select
      value={activeOrganization?.id || ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrganizationSelect;
