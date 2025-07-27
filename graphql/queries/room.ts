import { gql } from "@apollo/client";

const ROOM_FIELDS = gql`
  fragment RoomFields on Room {
    id
    roomName
    ownerId
    participants
  }
`;

export const GET_LIST_ROOMS = gql`
  query GetListRooms {
    getListRooms {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
