"use client";

import { authClient } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrganizationSelect from "./components/OrganizationSelect";
import OrganizationTabs from "./components/OrganizationTabs";
import CreateOrganizationButton from "./CreateOrganizationButton";

const OrganizationPage = () => {
  const { data: session, isPending: loading } = authClient.useSession();
  

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12 text-gray-600" />
      </div>
    );

    if (session === null) return redirect("/auth/login");

  return (
    <div className="container mx-auto my-p px-4 ">
      <Link className="inline-flex items-center mb-6" href="/">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <div className="flex items-center mb-8 gap-2 ">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>
      <OrganizationTabs/>
    </div>
  );
};

export default OrganizationPage;
