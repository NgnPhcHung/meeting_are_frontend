import { gql } from "@apollo/client";

export const USER_JOINED_SUBSCRIPTION = gql`
  subscription UserJoined {
    userJoined {
      userId
    }
  }
`;

export const USER_MOVE_SUBSCRIPTION = gql`
  subscription UserMoved {
    userMoved {
      userId
      position {
        x
        y
      }
    }
  }
`;

export const USER_DISCONNECT_SUBSCRIPTION = gql`
  subscription UserDisconnect {
    userDisconnected {
      userId
      position {
        x
        y
      }
    }
  }
`;
