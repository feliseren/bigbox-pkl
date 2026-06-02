import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, hashPassword } from "@/lib/auth";

const OAUTH_STATE_COOKIE = "bb_oauth_state";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
};

function getRedirectUri(requestUrl: string) {
  const origin = new URL(requestUrl).origin;
  return process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!code || !state || !clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/login?error=google", request.url));
    }

    const cookieState = request.headers.get("cookie")?.match(
      new RegExp(`${OAUTH_STATE_COOKIE}=([^;]+)`)
    )?.[1];

    if (!cookieState || cookieState !== state) {
      return NextResponse.redirect(new URL("/login?error=google_state", request.url));
    }

    const redirectUri = getRedirectUri(request.url);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenJson = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenJson.access_token) {
      return NextResponse.redirect(new URL("/login?error=google_token", request.url));
    }

    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`,
        },
      }
    );

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;
    const email = userInfo.email?.toLowerCase();
    const emailVerified = Boolean(userInfo.email_verified);

    if (!email || !emailVerified) {
      return NextResponse.redirect(new URL("/login?error=google_email", request.url));
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const displayName = userInfo.name || userInfo.given_name || "Pengguna BigBox";
      const randomPassword = cryptoRandomPassword();
      const hashedPassword = await hashPassword(randomPassword);
      user = await prisma.user.create({
        data: {
          email,
          fullName: displayName,
          password: hashedPassword,
          hasLocalPassword: false,
        },
      });
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(createSessionCookie(user.id, true));
    response.cookies.set({
      name: OAUTH_STATE_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set({
      name: "bb_remember",
      value: "1",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google login failed:", error);
    return NextResponse.redirect(new URL("/login?error=google", request.url));
  }
}

function cryptoRandomPassword() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
