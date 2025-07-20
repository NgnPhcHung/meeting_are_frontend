export interface RenewAccesseToken {
  accessToken: string;
}

export interface AuthResponse extends RenewAccesseToken {
  refreshToken: string;
}
