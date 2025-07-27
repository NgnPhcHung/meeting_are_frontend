import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshAccessToken {
    refreshAccessToken {
      accessToken
    }
  }
`;
