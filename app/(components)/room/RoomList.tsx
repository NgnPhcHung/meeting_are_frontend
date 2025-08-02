import { RoomResponse } from "@/types/room";
import { Empty, Space } from "antd";
import { RoomListItem } from "./RoomListItem";

interface Props {
  rooms?: RoomResponse[];
}

export const RoomList = ({ rooms }: Props) => {
  if (!rooms) {
    return <Empty />;
  }

  return (
    <Space direction="horizontal" size="middle" wrap>
      {rooms.map((room) => (
        <RoomListItem key={room.id} {...room} />
      ))}
    </Space>
  );
};
