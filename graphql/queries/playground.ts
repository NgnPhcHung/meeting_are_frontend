import { gql } from "@apollo/client";

export const LIST_PLAYER = gql`
  query players($roomName: String!) {
    players(roomName: $roomName) {
      userId
      position {
        x
        y
      }
      avatarImg
    }
  }
`;
