"use client";

import { createRoom } from "@/actions/room";
import { CreateRoomDto } from "@/dtos/createRoomDto";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { RoomResponse, RoomQueries } from "@/types/room";
import { useLazyQuery } from "@apollo/client";
import { Button, Form, Input, message } from "antd";

interface Props {
  rooms?: RoomResponse[];
}

export const CreateRoomForm = ({ rooms = [] }: Props) => {
  const [form] = Form.useForm<CreateRoomDto>();
  const [refetch] = useLazyQuery<RoomQueries>(GET_LIST_ROOMS, {});

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
    rooms?.length < 3 && (
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
    )
  );
};
