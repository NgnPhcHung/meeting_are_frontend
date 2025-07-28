"use client";

import { createRoom } from "@/actions/room";
import { RoomList } from "@/app/(components)/room/RoomList";
import { Selection } from "@/app/(components)/Selection";
import { CreateRoomDto } from "@/dtos/createRoomDto";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { RoomQueries } from "@/types/room";
import { useQuery } from "@apollo/client";
import { Button, Form, Input, message } from "antd";

export default function SelectionPage() {
  const [form] = Form.useForm<CreateRoomDto>();
  const { refetch } = useQuery<RoomQueries>(GET_LIST_ROOMS, { skip: true });

  const handleSubmit = async (formData: CreateRoomDto) => {
    try {
      const result = await createRoom({
        roomName: formData.roomName,
      });
      if (result.success) {
        message.success("Room created!");
        refetch();
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };
  return (
    <div className="">
      <Form onFinish={handleSubmit} form={form}>
        <Form.Item
          label="Room Name"
          name="roomName"
          rules={[{ required: true }]}
        >
          <Input autoFocus tabIndex={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
      <RoomList />
      <Selection />
    </div>
  );
}
