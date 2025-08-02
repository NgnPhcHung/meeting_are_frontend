import { inviteToRoom, updateRoom } from "@/actions/room";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { useDebounce } from "@/hooks/useDebounce";
import { RoomQueries, RoomResponse } from "@/types/room";
import { useQuery } from "@apollo/client";
import { Divider, Empty, Input, message, Modal, Space } from "antd";
import { Button } from "antd/es/radio";
import { useState, ChangeEvent } from "react";

interface Props {
  opened: boolean;
  onClose: () => void;
  room: RoomResponse;
}

export const UpdateRoomModal = ({ opened, onClose, room }: Props) => {
  const [changedValue, setChangedValue] = useState(room.roomName);
  const [participantsMail, setParticipantsMail] = useState("");
  const { refetch } = useQuery<RoomQueries>(GET_LIST_ROOMS, { skip: true });

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setChangedValue(event.target.value);
  };

  const handleChangeParticipantMail = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setParticipantsMail(event.target.value);
  };

  const inputDebounceHandler = useDebounce(handleChangeInput, 500);
  const inputDebounceMailHandler = useDebounce(
    handleChangeParticipantMail,
    500,
  );

  const handleSubmit = async () => {
    await updateRoom({ roomName: changedValue, id: room.id });
    refetch();
    onClose();
  };

  const handleSendInvite = async () => {
    await inviteToRoom({ participants: participantsMail, roomId: room.id });
    message.success("Invitation sent");
  };

  return (
    <Modal
      open={opened}
      onCancel={onClose}
      onOk={handleSubmit}
      title="Update Room"
      okText="Save"
    >
      <Space
        direction="vertical"
        align="start"
        className="w-full"
        classNames={{
          item: "w-full",
        }}
      >
        <Input defaultValue={changedValue} onChange={inputDebounceHandler} />
        <Divider>Participants</Divider>

        <div className="flex gap-4">
          <Input
            placeholder="Email, comma or space seperated"
            onChange={inputDebounceMailHandler}
          />
          <Button onClick={handleSendInvite}>Invite</Button>
        </div>
        <Empty description="No any Participants" />
      </Space>
    </Modal>
  );
};
