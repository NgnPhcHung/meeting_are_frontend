"use server";

import { cookies } from "next/headers";

export async function setCookie(key: string, value: string, age: number) {
  cookies().set(key, value, {
    httpOnly: true,
    path: "/",
    maxAge: age,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
