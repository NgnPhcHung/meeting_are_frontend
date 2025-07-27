import { gql } from "@apollo/client";

const ROOM_FIELDS = gql`
  fragment RoomFields on Room {
    id
    roomName
    ownerId
    participants
  }
`;

export const CREATE_ROOM = gql`
  mutation Room($input: CreateRoomDto!) {
    createRoom(input: $input) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
