import { GithubIcon } from "@/components/auth/o-auth-icons";
import {  ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github"] as const;

export type OAuthProvider = typeof SUPPORTED_OAUTH_PROVIDERS[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<OAuthProvider, { name: string; icon: ElementType<ComponentProps<"svg">>}> = {
    // google: {
    //     name: "Google",
    //     icon: GoogleIcon,
    // },
    github: {
        name: "Github",
        icon: GithubIcon,
    },
};