"use server";

import { LoginDto } from "@/dtos";
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";
import { getClient } from "@/libs/apolloClient";
import { AuthResponse } from "@/types/authResponse";
import { decodeJwt } from "@/utils/decodeJwt";
import { setCookie } from "@/utils/setAuthCookie";

const FIFTEEN_MINS = 15 * 60;
const SEVEN_DAYS = 7 * 24 * 60 * 60;

export async function userLogin(body: LoginDto) {
  try {
    const { data } = await getClient().mutate<{
      login: AuthResponse;
    }>({
      mutation: LOGIN_MUTATION,
      variables: { input: body },
    });

    if (!data || !data.login || !data.login.accessToken) {
      return {
        success: false,
        message: "Login failed: Invalid credentials or server error.",
      };
    }

    const accessToken = data.login.accessToken;
    const refreshToken = data.login.refreshToken;

    setCookie("authorization", `Bearer ${accessToken}`, FIFTEEN_MINS);
    setCookie("refreshToken", refreshToken, SEVEN_DAYS);

    const user = decodeJwt(accessToken);
    return { success: true, message: "Login successful", data: user };
  } catch (error) {
    throw {
      success: false,
      message: (error as Error).message,
    };
  }
}
