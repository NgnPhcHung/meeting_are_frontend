"use client";

import { RoomResponse } from "@/types/room";
import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { UpdateRoomModal } from "./UpdateRoomModal";

export const RoomListItem = (room: RoomResponse) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { roomName, id } = room;

  const handleRoomClicked = () => {
    router.push(`/playground/${id}`);
  };

  const handleOpenModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    event.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Space
        direction="horizontal"
        size="middle"
        className="w-full cursor-pointer hover:bg-gray-900 p-2 rounded"
        onClick={handleRoomClicked}
      >
        <Typography>{roomName}</Typography>
        <Button onClick={handleOpenModal}>
          <EditOutlined size={16} />
        </Button>
      </Space>
      <UpdateRoomModal
        opened={isModalOpen}
        onClose={handleCloseModal}
        room={room}
      />
    </>
  );
};
