import { gql } from "@apollo/client";

const PLAYER_FIELDS = gql`
  fragment PlayerFields on Player {
    userId
    avatarImg
    position {
      x
      y
    }
  }
`;

export const USER_JOINED_SUBSCRIPTION = gql`
  subscription join {
    userJoined {
      userId
      position {
        x
        y
      }
      avatarImg
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
