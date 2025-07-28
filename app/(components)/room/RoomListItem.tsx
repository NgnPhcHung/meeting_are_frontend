import { RoomResponse } from "@/types/room";
import { Space } from "antd";
import { useRouter } from "next/navigation";
import { ToggleableText } from "../ToggleableText";
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
      <ToggleableText value={roomName} id={id} />
    </Space>
  );
};
