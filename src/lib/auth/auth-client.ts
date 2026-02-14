import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import { inferAdditionalFields, twoFactorClient, adminClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client"


export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>(),
    passkeyClient(), adminClient(), twoFactorClient({
        onTwoFactorRedirect: () => {
            window.location.href = "/auth/2fa"
        }
    })],
})