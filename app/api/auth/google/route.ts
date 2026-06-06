import { NextResponse } from "next/server";
import crypto from "crypto";
import { toAppUrl } from "@/lib/app-url";

const OAUTH_STATE_COOKIE = "bb_oauth_state";

function getRedirectUri(requestUrl: string) {
  return process.env.GOOGLE_REDIRECT_URI || toAppUrl("/api/auth/google/callback", requestUrl).toString();
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(toAppUrl("/login?error=google_config", request.url));
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = getRedirectUri(request.url);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  response.cookies.set({
    name: OAUTH_STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
