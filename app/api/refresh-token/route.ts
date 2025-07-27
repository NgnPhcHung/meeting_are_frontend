import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const res = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
    body: JSON.stringify({
      query: `
        mutation {
          refreshAccessToken {
            accessToken
          }
        }
      `,
    }),
  });

  const setCookie = res.headers.get("set-cookie");

  if (res.ok && setCookie) {
    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", setCookie);
    return response;
  }

  return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
}
