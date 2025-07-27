export interface RoomResponse {
  id: number;
  roomName: string;
  ownerId: number;
  participants: number[];
}

export interface RoomQueries {
  getListRooms: RoomResponse[];
}
