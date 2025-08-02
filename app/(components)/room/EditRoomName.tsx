import { updateRoom } from "@/actions/room";
import { GET_LIST_ROOMS } from "@/graphql/queries/room";
import { useDebounce } from "@/hooks/useDebounce";
import { RoomQueries } from "@/types/room";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Input, Typography } from "antd";
import { ChangeEvent, MouseEvent, useState } from "react";

interface Props {
  value: string;
  id: number;
  more?: any;
}

export const EditRoomName = ({ value, id }: Props) => {
  const [isInput, setIsInput] = useState(false);
  const [changedValue, setChangedValue] = useState(value);
  const { refetch } = useQuery<RoomQueries>(GET_LIST_ROOMS, { skip: true });

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);

    setChangedValue(event.target.value);
  };
  const inputDebounceHandler = useDebounce(handleChangeInput, 500);

  const openInput = () => {
    setIsInput(true);
  };

  const closeInput = () => {
    setIsInput(false);
    setChangedValue(value);
  };

  const handleSubmit = async () => {
    await updateRoom({ roomName: changedValue, id });
    setIsInput(false);
    refetch();
  };
  const buttonClick =
    (handler: Function) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      handler();
    };

  return isInput ? (
    <div
      className="flex items-center space-x-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Input defaultValue={changedValue} onChange={inputDebounceHandler} />
      <div className="flex items-center space-x-2">
        <Button onClick={buttonClick(closeInput)}>
          <CloseOutlined />
        </Button>
        <Button onClick={buttonClick(handleSubmit)}>
          <CheckOutlined />
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex space-x-2 items-center">
      <Typography>{value}</Typography>
      <Button onClick={buttonClick(openInput)}>
        <EditOutlined />
      </Button>
    </div>
  );
};
