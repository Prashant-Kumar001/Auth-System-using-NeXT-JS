import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, {
    shield,
    BotOptions,
    SlidingWindowRateLimitOptions,
    EmailOptions,
    protectSignup,
    detectBot,
    slidingWindow,
} from "@arcjet/next";
import { findIp } from "@arcjet/ip";

const aj = arcjet({
    characteristics: ["userIdOrId"],
    key: process.env.ARCJET_KEY!,
    rules: [
        shield({
            mode: "LIVE",
        }),
    ],
});

const botSettings = { mode: "LIVE", allow: [] } satisfies BotOptions;
const restrictiveRateLimitSettings = {
    mode: "LIVE",
    max: 10,
    interval: "10m",
} as SlidingWindowRateLimitOptions<[]>;
const laxRateLimitSettings = {
    mode: "LIVE",
    max: 60,
    interval: "1m",
} as SlidingWindowRateLimitOptions<[]>;



const emailSettings = {
    mode: "LIVE",
    allow: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} as EmailOptions;


const authHandler = toNextJsHandler(auth);
export const { GET } = authHandler;

export async function POST(request: Request) {
    const clonedRequest = request.clone();
    const decision = await checkArcjet(request);
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return new Response(null, { status: 429 });
        } else if (decision.reason.isEmail()) {
            let message: string = "";
            if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "Disposable email addresses are not allowed.";
            } else if (decision.reason.emailTypes.includes("INVALID")) {
                message = "Invalid email addresses are not allowed.";
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "Email addresses without MX records are not allowed.";
            } else {
                message = "Something went wrong.";
            }
            return new Response(JSON.stringify({ message }), { status: 400 });
        } else {
            return new Response(null, { status: 403 });
        }
    }
    return authHandler.POST(clonedRequest);
}
async function checkArcjet(request: Request) {
    const body = (await request.json()) as unknown;
    const session = await auth.api.getSession({ headers: request.headers });
    const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

    if (request.url.endsWith("/auth/sign-up")) {
        if (
            body &&
            typeof body === "object" &&
            "email" in body &&
            typeof body.email === "string"
        ) {
            return aj
                .withRule(
                    protectSignup({
                        email: emailSettings,
                        bots: botSettings,
                        rateLimit: laxRateLimitSettings,
                    }),
                )
                .protect(request, {
                    userIdOrId: userIdOrIp,
                    email: body.email,
                });
        }
    } else {
        return aj
            .withRule(detectBot(botSettings))
            .withRule(slidingWindow(restrictiveRateLimitSettings))
            .protect(request, {
                userIdOrId: userIdOrIp,
            });
    }
    return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, {
            userIdOrId: userIdOrIp,
        });
}
