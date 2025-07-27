import { RoomResponse } from "@/types/room";
import { Card, Space } from "antd";
import { useRouter } from "next/navigation";

export const RoomListItem = ({ participants, roomName, id }: RoomResponse) => {
  const router = useRouter();

  const handleRoomClicked = () => {
    router.push(`/playground/${id}`);
  };

  return (
    <Space
      direction="vertical"
      size="middle"
      className="w-full"
      onClick={handleRoomClicked}
    >
      <Card title={roomName}>
        <p>{participants}</p>
      </Card>
    </Space>
  );
};
